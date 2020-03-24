const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const jwt = require('jsonwebtoken')

const app = express()
const secretKey = 'thisisverysecretkey'
const port = 8080

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const koneksi = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pro_sekolah-bantuan'
})

koneksi.connect((err) => {
    if(err) throw err
    console.log('Database Connect...')
})

app.listen(port, () => {
    console.log('Port connect = ' + port)
})
//========Authentification===========//
//------------Authorization---------------//
const isAuthorized = (req, res, next) => {
    if(typeof(req.headers['x-api-key']) == 'undefined')
    {
        return res.status(403).json({
            success: false,
            message: 'Unathorized Token is not provided'
        })
    }


let token = req.headers['x-api-key']

jwt.verify(token, secretKey, (err, decoded) => {
    if(err)
    {
        return res.status(403).json({
            success: false,
            message: 'Unathorized Token is not provided'
        })
    }
})

next()
}


//------------Register---------------//
app.post('/register', (req, res) => {
    let data = req.body
    let sql = `
        insert into users(username, password)
        values('`+data.username+`','`+data.password+`')
    `
    koneksi.query(sql, (err, res) => {
        if(err) throw err
    })

    res.json({
        success: true,
        message: 'Register Success',
        username: data.username,
        password: data.password,

    })
})


//------------Login Admin---------------//
app.post('/login/admin', (req, res) => {
    let data = req.body

    if(data.username == 'admin' && data.password == 'admin')
    {
        let token = jwt.sign(data.username + ' | ' + data.password, secretKey)

        res.json({
            success: true,
            message: 'Admin Login',
            username: data.username,
            password: data.password,
            token: token
        })
    }
    res.json({
        success: false,
        message: 'riko sanes seng nduwe username admin karo password admin'
    })
})

//------------Login User---------------//
app.post('/login/users', function(req, res) {
    let data = req.body
    var username = data.username;
    var password = data.password;
    if(username && password)
    {
        conn.query(`select * from users where username = ? and password = ?`, [username, password], function(err, results, fields) {
            if(results.length > 0) {
                let token = jwt.sign(data.username + '|' + data.password, secretKey)
                res.json({
                    success: true,
                    message: 'User Login',
                    username: data.username,
                    password: data.password,
                    token: token
                });
            }
            else
            {
                res.json({
                    success: false,
                    message: 'Invalid',
                });
            }
            res.end();
        });
    }
});





//==============CRUD================//
//--------------Select--------------//
app.get('/sekolah', (req, res) => {
    let sql = `select * from sekolah`
    koneksi.query(sql, (err, result) => {
        if(err) throw err
        res.json({
            message: true,
            data: result
        })
    })
})

//--------------Create--------------//
app.post('/sekolah', (req, res) => {
    let data = req.body
    let sql = `
        insert into sekolah(nama_sekolah, alamat, kategori, bantuan, keterangan)
        values('`+data.nama_sekolah+`','`+data.alamat+`','`+data.kategori+`','`+data.bantuan+`','`+data.keterangan+`')
    `
    koneksi.query(sql, (err, result) => {
        if(err) throw err
        res.json({
            message: 'Data Added',
            data: result
        })
    })
})

//--------------Update--------------//
app.put('/sekolah/:id', (req, res) => {
    let data = req.body
    let sql = `
        update sekolah
        set nama_sekolah = '`+data.username+`', alamat = '`+data.password+`', kategori = '`+data.kategori+`', bantuan = '`+data.bantuan+`', keterangan = '`+data.keterangan+`'
        where id = `+req.params.id+`
    `
    koneksi.query(sql, (err, result) => {
        if(err) throw err
        res.json({
            message: 'Data Updated',
            data: result
        })
    })
})


//--------------Delete--------------//
app.delete('/sekolah/:id', (req, res) => {
    let sql = `
        delete from sekolah where id = '`+req.params.id+`'
    `
    koneksi.query(sql, (err, result) => {
        if(err) throw err
        res.json({
            message: 'Data deleted',
            data: result
        })
    })
})

