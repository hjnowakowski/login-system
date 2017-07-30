var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

//db
mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;

//Creates folders with index and users
var routes = require('./routes/index');
var users = require('./routes/users');


//Init app
var app = express();

//View Engine
app.set('views', path.join(__dirname, 'views')); //we want views folder to handle views
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');


//BodyParser Middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieparser());

//Set Static folders
app.use(express.static(path.join(__dirname, 'public'))); //in public file styles, jquery etc are stored

//Express session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

//passport Init
app.use(passport.initialize());
app.use(passport.session());

//express Validator

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//connect flash
app.use(flash());

//global variables

app.use(function (req, res, nest){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
//res.locals is used to create global variables

app.use('/', routes);
app.use('/users', users);

app.set('port', (process.env.PORT || 3002));

app.listen(app.get('port'), function(){
  console.log('Server started on port ' + app.get('port'));
});
