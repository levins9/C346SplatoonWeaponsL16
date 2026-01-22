const express = require ('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;

//database config info
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

const app = express();
app.use(express.json());

app.listen(port, () => {
    console.log('Server running on port', port)
});

app.get('/allweapons', async (req, res) => {
    try{
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM defaultdb.weapons');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error for allweapons'});
    }
})
app.post('/addweapon', async (req, res) => {
    const {weapon_name, weapon_pic} =req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO defaultdb.weapons  (weapon_name, weapon_pic) VALUES (?,?)',[weapon_name, weapon_pic]);
        res.status (201).json({message: weapon_name + ' successfully added'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not add '+ weapon_name });
    }
})

app.put('/weapons/:id', async (req, res) => {
    const { weapon_id } = req.params;
    const { weapon_name, weapon_pic } = req.body;


    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'UPDATE defaultdb.weapons SET weapon_name = ?, weapon_pic = ? WHERE id = ?',
            [weapon_name, weapon_pic, weapon_id]
        );
        res.json({ message: 'Weapon successfully updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not update weapon' });
    }
});

app.delete('/weapons/:id', async (req, res) => {
    const { weapon_id } = req.params;

    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'DELETE FROM defaultdb.weapons WHERE id = ?',
            [weapon_id]
        );
        res.json({ message: 'Weapon successfully deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not delete weapon' });
    }
});