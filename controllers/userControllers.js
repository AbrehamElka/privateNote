const pool = require("../db/pool");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const secret = process.env.JWT_SECRET;

exports.createNewUser = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({ errors: errors.array() });
    }

    const { firstname, lastname, email, userPassword } = req.body;
    
    try {
        
        const userExist = await pool.query('SELECT * FROM users WHERE email = $1::varchar(20)', [email]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ message: "User Already Exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userPassword, salt);

        const newUser = await pool.query(`INSERT INTO users (firstname, lastname, email, userPassword)
            VALUES ($1::varchar(20), $2::varchar(20), $3::varchar(20), $4::text)
            RETURNING id, firstname, lastname, email`, 
            [firstname, lastname, email, hashedPassword]);
        
        res.status(201).json({user: newUser.rows[0]});
        
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
};



exports.loginUser = async(req, res) => {

    const { email, userPassword } = req.body;

    try {
        
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1::text', [email]);

        if (userExists.rows.length === 0) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        console.log("User", userExists.rows[0]);
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

        const token = jwt.sign(payload, secret, { expiresIn: '1h' });

        res.json({ token });

    } catch(err) {
        console.error(err.message);
        res.status(500).json({ message: "server error" });
    }
}