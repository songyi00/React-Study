const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database
});

connection.connect();

const multer = require('multer');
const upload = multer({dest : './upload'});

// 고객 데이터 조회 
app.get('/api/customers',(req,res) => {
    connection.query(
        "select * from customer where isDeleted = 0;",
        (err,rows,fields)=>{
            res.send(rows);
        }
    );
});

app.use('/image',express.static('./upload')); //클라이언트의 image 루트가 우리에게는 upload 폴더 
console.log('안녕 서버?');
app.post('/api/customers',upload.single('image'), (req,res)=> {
    let sql = 'INSERT INTO CUSTOMER VALUES (null,?,?,?,?,?,now(),0)';
    let image = '/image/'+req.file.filename;
    let name = req.body.name;
    let birthday = req.body.birthday;
    let gender = req.body.gender
    let job = req.body.job;
    let params = [image,name,birthday,gender,job];
   
    connection.query(sql,params,
        (err,rows,fields) => {
            res.send(rows);
            console.log(err);
            console.log(rows);
        }      
    );
});

app.delete('/api/customers/:id' , (req,res) => {
    let sql = 'UPDATE CUSTOMER SET isDeleted = 1 WHERE ID = ?';
    let params = [req.params.id];
    connection.query(sql,params,
        (err,rows,fields) => {
            res.send(rows);
        }
    )
});

app.listen(port,()=> console.log(`Listening on port ${port}`));