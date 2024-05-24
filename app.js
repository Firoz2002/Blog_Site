const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const connect = require('./config/database');

require('dotenv').config();
const app = express();
const PORT = process.env.PORT

app.set('view engine', 'ejs');

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(require('./route/route'));

app.use(express.static(path.join(__dirname ,'public')));

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