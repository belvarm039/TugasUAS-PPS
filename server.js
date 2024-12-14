const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to parse URL-encoded bodies

// Konfigurasi Koneksi MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Ganti sesuai dengan username MySQL Anda
  password: '', // Ganti sesuai dengan password MySQL Anda
  database: 'fastbite', // Nama database
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

// Endpoint untuk mendapatkan semua data
app.get('/menus', (req, res) => {
  const query = 'SELECT menuid, menu_name, stock FROM menu';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

// Endpoint untuk mendapatkan 1 data berdasarkan menuid
app.get('/menus/:menuid', (req, res) => {
  const { menuid } = req.params;
  const query = 'SELECT menuid, menu_name, stock FROM menu WHERE menuid = ?';
  db.query(query, [menuid], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send(err);
      return;
    }
    res.json(results[0]); // Ambil objek pertama dari hasil query
  });
});

// Endpoint untuk update data
app.put('/menus/:menuid', (req, res) => {
    // buat variabel penampung data dan query sql
    const data = { ...req.body };
    const querySearch = 'SELECT * FROM menu WHERE menuid = ?';
    const queryUpdate = 'UPDATE menu SET ? WHERE menuid = ?';

    // jalankan query untuk melakukan pencarian data
    db.query(querySearch, req.params.menuid, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'There is an error', error: err });
        }

        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {
            // jalankan query update
            db.query(queryUpdate, [data, req.params.menuid], (err, rows, field) => {
                // error handling
                if (err) {
                    return res.status(500).json({ message: 'There is an error', error: err });
                }

                // jika update berhasil
                res.status(200).json({ success: true, message: 'Successfully updated menu data!' });
            });
        } else {
            return res.status(404).json({ message: 'Menu data not found!', success: false });
        }
    });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
