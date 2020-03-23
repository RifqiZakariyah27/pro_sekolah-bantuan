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

