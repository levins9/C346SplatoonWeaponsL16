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
            const connection = await mysql.createConnection(dbConfig);

            const [result] = await connection.execute(
                'UPDATE defaultdb.weapons SET weapon_name = ?, weapon_pic = ? WHERE weapon_id = ?',
                [weapon_name, weapon_pic, weapon_id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Weapon not found' });
            }

            res.json({ message: `Weapon ${weapon_id} updated successfully` });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error - could not update weapon' });
        }
    });

    app.delete('/weapons/:id', async (req, res) => {
        const { weapon_id } = req.params;

        try {
            const connection = await mysql.createConnection(dbConfig);

            // Optional: get the weapon first to show the name in the response
            const [rows] = await connection.execute(
                'SELECT weapon_name FROM defaultdb.weapons WHERE weapon_id = ?',
                [weapon_id]
            );

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Weapon not found' });
            }

            const weapon_name = rows[0].weapon_name;

            const [result] = await connection.execute(
                'DELETE FROM defaultdb.weapons WHERE weapon_id = ?',
                [weapon_id]
            );

            res.json({ message: weapon_name + ' deleted successfully' });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error - could not delete weapon' });
        }
    });
