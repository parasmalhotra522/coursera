var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var util= require('util');
var fs = require("fs");
var ejs = require('ejs');
var passport = require('passport'); 
var authenticate = require('./authenticate');

var session = require('express-session');
var fileStore = require('session-file-store')(session); 
// importing the session and filestore to store the details of the session

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promoRouter');

var app = express();
const url = 'mongodb://localhost:27017/confusion';
const mongoose = require('mongoose');
const connect = mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology: true});

connect.then((db)=>{
  console.log("Connected Successfully");
}).catch((err)=>{
  console.log(err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('view engine','jade');

// these are the middle wares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.use(express.static(path.join(__dirname, 'public'))); // this allows to view the static data to the client

app.use('/dishes', dishRouter);
app.use('/leaders',leaderRouter);
app.use('/promotions',promoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
