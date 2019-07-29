var path = require('path')
const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');//

const user = require('./router/user');
const login = require('./router/login');

//这一句是连接上数据库

//这里的myDbs是数据库的名字，不是表的名字

const app = express()
app.set('views', path.join(__dirname, 'views'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/user',user)
app.use('/login',login)
app.use('/static', express.static(path.join(__dirname, 'static')))
app.use('/',login)
app.listen(3000, () => {
    console.log('app listening on port 3000.')
})


