const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const connect = require('./config/database');

const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../Client/views'));

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '../Client/public')));

app.use(require('./route/route'));

app.get('/', (req, res) => { res.render('home') });
app.get('/register', (req, res) => { res.render('register') });
app.get('/login', (req, res) => { res.render('login') });
app.get('/blog/:id', (req, res) => { res.render('blog') });
app.get('/publish', (req, res) => { res.render('publish') });

app.get('/test', (req, res) => { res.render('test')} );

app.listen(PORT, async () => {
    try {
        console.log(`Server started on PORT: ${PORT}`);
        await connect();
        console.log('Mongodb Connected');
    } catch (error) {
        throw {error}
    }
})