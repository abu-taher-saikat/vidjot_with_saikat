const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session')
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
const passport = require('passport');


// fixing handlebars read data from mongo problem && Import function exported by newly installed node  
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

const app = express();

// Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// mongo atlash
const atlas = 'mongodb+srv://saikat:saikat1095@cluster0-htwdq.mongodb.net/vidjot_saikat?retryWrites=true&w=majority'

// connect mongodb 
mongoose.connect(atlas, {
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(()=> console.log('MongoDB connected...'))
.catch(err=> console.log(err))

// handlebars middleware
app.engine('handlebars',exphbs({
    defaultLayout : 'main',
    handlebars : allowInsecurePrototypeAccess(Handlebars)
}))
app.set('view engine', 'handlebars');

// body parser middleware
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// override middleware
app.use(methodOverride('_method'))

// express session middleware
app.use(session({
    secret : "secret",
    resave : true,
    saveUninitialized : true
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// set flash router
app.use(flash());

// set global variable for flash
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})


app.use(function(req, res, next){
    res.locals.seccess_msg = req.flash('this is new success message for me, job done');
    res.locals.error_msg = req.flash('error_msg')
})


// Index Router
app.get('/',(req, res)=>{
    const title = 'Welcome';
    res.render('index',{
        title : title
    });
});

// about route 
app.get('/about',(req, res)=>{
    res.render('about')
})





// user routes 
app.use('/ideas', ideas);
app.use('/users', users);

// Passport config
require('./config/passport')(passport);


// const port = 4000
// // app.listen(port,()=>{
// //     console.log(`Server started on ${port}`);
// // })
// app.listen(port, (err) => {  
//     if (err) {
//       return console.log('something bad happened', err)
//     }
  
//     console.log(`server is listening on ${port}`)
//   })

  const port = 5000;
  app.listen(port, ()=>{
      console.log(`Server started on port ${port}`);
  })