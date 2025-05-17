const pool = require("../db/pool");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");



const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
}

const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1m' })
}
// register
exports.createNewUser = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { firstname, lastname, email, userPassword } = req.body;
    
    try {
        
        const userExist = await pool.query('SELECT * FROM users WHERE email = $1::varchar(20)', [email]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ message: "User Already Exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userPassword, salt);

        const newUser = await pool.query(`INSERT INTO users (firstname, lastname, email, userpassword)
            VALUES ($1::varchar(20), $2::varchar(20), $3::varchar(20), $4::text)
            RETURNING id, firstname, lastname, email`, 
            [firstname, lastname, email, hashedPassword]);
        
        res.status(201).json({user: newUser.rows[0]});
        
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
};


// login
exports.loginUser = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { email, userPassword } = req.body;
    
    try {
        
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1::text', [email]);

        if (userExists.rows.length === 0) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const verifiedUser = await bcrypt.compare(userPassword, userExists.rows[0].userpassword);
        if(!verifiedUser) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }




        const payload = {
            id: userExists.rows[0].id,
            firstname: userExists.rows[0].firstname,
            lastname: userExists.rows[0].lastname,
            email: userExists.rows[0].email
        }

        const token = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
            maxAge: 7 * 12 * 60 * 60 * 1000
        });

        res.json({ token });

    } catch(err) {
        console.error(err.message);
        res.status(500).json({ message: "server error" });
    }
}

exports.refereshToken = async(req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(401).json({ error: "server error"});
    }

    try {
        jwt.verify(token, process.env.JWT_REFERESH_SECRET, (err, user) => {
            if (err) return res.status(403).json({ error: "server error" });

            req.user = user;
            const accessToken = generateAccessToken(req.user);

            return res.json({ accessToken });
        });
    } catch(err) {
        console.error(err.message);
        res.status(500).json({ error: "server error" });
    }
}