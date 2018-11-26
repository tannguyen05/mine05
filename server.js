const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/database');
const home = require('./routes/home');
const admin = require('./routes/admin');
const signup = require('./routes/signup');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const validator = require('express-validator');
const fileUpload = require('express-fileupload');
const pages = require('./models/page.js');
const categories = require('./models/category.js');
const passport = require('passport');

//init app
const app = express();

//file-updload middleware
app.use(fileUpload());

// body-parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//validator middleware
app.use(validator({
    //custom post file
    customValidators: { 
        isImage: (value, filename)=>{
            let extension = (path.extname(filename)).toLowerCase();
            switch(extension){
                case '.jpg':
                    return '.jpg';
                case '.jpeg':
                    return '.jpeg';
                case '.png':
                    return '.png';
                case '.gif':
                    return '.gif';
                case '':
                    return '.jpg';
                default:
                    return false;
            }
        }
    }
}));

// express-session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {}
}))

//passport config
//require("./config/passport.js")(passport);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect-flash middleware
app.use(flash());



// connect database
mongoose.connect(config.database, {useNewUrlParser: true}, (err)=>{
    if(err) throw err;
    console.log('Database connected.');
})
mongoose.set('useFindAndModify', false);

//set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//public folder
app.use(express.static(path.join(__dirname, 'public')));

//get all page pass to header.ejs
pages.find({}, (err, pages)=>{
    if(err) throw err;
    app.locals.pages = pages;
})

//get all page pass to header.ejs
categories.find({}, (err, categories)=>{
    if(err) throw err;
    app.locals.categories = categories;
})
app.get('*', (req, res, next)=> {
    res.locals.cart = req.session.cart;
    next();
});
//router
app.use('/', home);
app.use('/admin', admin);
// app.use('/signup', signup);

//server listen
let port = 3000 || process.env.PORT;
app.listen(port, ()=>{console.log('Server started on port', port)})

