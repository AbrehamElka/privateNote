const pool = require("../db/pool");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const secret = process.env.JWT_SECRET;

exports.authenticate = async(req, res, next) => {
    try {
        const autheader = req.headers['authorization'];
        const token = autheader && autheader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: "Access Denied"});
        }

        jwt.verify(token, secret, (err, user) => {
            if (err) return res.status(403).json({ error: "Access Denied" });
            req.user = user;
            next();
        });
    } catch(err) {
        console.error(err.message);
        res.status(500).json({ error: "server error" });
    }
}
exports.getAllnotes = async(req, res) => {
    const user = req.user;
    
    try {
        const allnotes = await pool.query(`
            SELECT notes.id, notes.title, notes.notecontent, notes.active, notes.created_at, notes.last_updated
            FROM notes
            WHERE userid = $1::integer AND notes.active = true`, [user.id]);
        
        if(allnotes.rows.length === 0) {
            return res.status(200).json({ message: "No notes Saved"});
        }

        res.status(200).json({ notes: allnotes.rows });
    } catch(err) {
        console.error(err.message);
        res.status(500).json({ error: "server error" });
    }
} 

exports.createNote = async(req, res) => {
    const { title, notecontent } = req.body;
    try {
        const newnote = await pool.query(`
            INSERT INTO notes (title, notecontent, userid) 
            VALUES ($1::text, $2::text, $3::integer) 
            RETURNING id, title`, [title, notecontent, req.user.id]);
        
        res.status(201).json({ message: "New Note Created Succusfully", note: newnote.rows[0]});
        
    } catch(err) {
        console.error(err.message);
        res.status(500).json({ error: "server error" });
    }
}

exports.updateNote = async(req, res) => {
    const id = parseInt(await req.params.id);
    const { title, notecontent } = req.body;
    
    try {
        const updatedNote = await pool.query(`
            UPDATE notes
            SET title = $1::text,
                notecontent = $2::text
            WHERE id = $3::integer AND userid = $4::integer AND active = true
            RETURNING id, title, notecontent
            `,
            [ title, notecontent, id, req.user.id ]
        );

        if (updatedNote.rows.length === 0) {
            return res.status(404).json({ error: "note not found!" });
        }

        res.status(200).json({ updatedNote: updatedNote.rows[0] });
    } catch(err) {
        console.log(err.message);
        res.status(500).json({ error: "server error" });
    }
}

exports.deleteNote = async(req, res) => {
    const id = parseInt(await req.params.id);
    
    try {
        const deletedNote = await pool.query(`
            UPDATE notes
            SET active = false
            WHERE id = $1::integer AND userid = $2::integer AND active = true
            RETURNING id, title, notecontent
            `,
            [ id, req.user.id ]
        );

        if (deletedNote.rows.length === 0) {
            return res.status(404).json({ error: "note not found!" });
        }

        res.status(200).json({ deletedNote: deletedNote.rows[0] });
    } catch(err) {
        console.log(err.message);
        res.status(500).json({ error: "server error" });
    }
}

exports.getNote = async(req, res) => {
    const id = parseInt(await req.params.id);
    
    try {
        const note = await pool.query(`
            SELECT id, title, notecontent, last_updated
            FROM notes
            WHERE id = $1::integer AND active = true AND userid = $2::integer
            `,
            [ id, req.user.id ]
        );

        if (note.rows.length === 0) {
            return res.status(404).json({ error: "note not found!" });
        }

        res.status(200).json({ note: note.rows[0] });
    } catch(err) {
        console.log(err.message);
        res.status(500).json({ error: "server error" });
    }
}