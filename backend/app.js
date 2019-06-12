var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var mongoose = require('mongoose');
require('./config')
var validator = require('express-validator');

var app = express();

var adminApi = require('./api/routes/adminRoutes');
var api = require('./api/routes/routes');

//Database connection
mongoose.connect(process.env.MONGODB_CONNECTION, {useNewUrlParser: true},(err) =>{
    if(err){
        console.log(err.message);
    } else {
        console.log("Conncected Successfully");
    }
});

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/admin', adminApi);
app.use('/api/', api);


app.use((req,res,next) => {
    const error = new Error('Not found');
    res.status(404);
    next(error);
})

app.use((error,req,res) => {
    res.status(req.status || 500)
    res.json({message:error.message})
})

module.exports = app;
