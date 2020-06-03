const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session')
const flash = require('connect-flash');
const methodOverride = require('method-override');


// fixing handlebars read data from mongo problem && Import function exported by newly installed node  
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

const app = express();

// mongo atlash
const atlas = 'mongodb+srv://saikat:saikat1095@cluster0-htwdq.mongodb.net/test?retryWrites=true&w=majority'

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

// override middleware
app.use(methodOverride('_method'))

// express session middleware
app.use(session({
    secret : "secret",
    resave : true,
    saveUninitialized : true
}))

// set flash router
app.use(flash());

// set global variable for flash
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    next();
})

// requring Idea model
const Idea = require('./models/Idea');



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

// Idea index page
app.get('/ideas',(req, res)=>{
    Idea.find({})
    .sort({date : 'desc'})
    .then(ideas =>{
        res.render('ideas/index',{
            ideas : ideas
        })
    })
})

// Add idea form
app.get('/ideas/add',(req, res)=>{
    res.render('ideas/add');
});


// Edit idea form
app.get('/ideas/edit/:id', (req,res)=>{
    Idea.findOne({_id : req.params.id})
    .then(idea =>{
        res.render('ideas/edit',{
            idea : idea
        })
    });
});

// process Form
app.post('/ideas',(req, res)=>{
    let errors = [];

    if(!req.body.title){
        errors.push({text : 'Please add a title'});
    }
    if(!req.body.details){
        errors.push({text : "Please add some details"});
    }

    if(errors.length > 0){
        res.render('ideas/add',{
            errors : errors,
            title : res.body.title,
            details : req.body.details
        })
    } else{
        const newUser = {
            title : req.body.title,
            details : req.body.details
        }
        new Idea(newUser)
        .save()
        .then(idea=>{
            req.flash('success_msg','Video idea Posted');
            res.redirect('/ideas')
        })
    }
});
// Edit Form process
app.put('/ideas/:id',(req, res)=>{
    // res.send('put')
    Idea.findOne({
        _id : req.params.id
    }).then(idea =>{
        // new values
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
        .then(()=>{
            req.flash('success_msg', "video idea updated");
            res.redirect('/ideas');
        })
    })
})


// Delete Idea
app.delete('/ideas/:id',(req, res)=>{
    // res.send('delete)
    Idea.deleteOne({_id: req.params.id})
    .then(()=>{
        req.flash('success_msg',"Video idea removed");
        res.redirect('/ideas');
    })
})

const port = 5000
app.listen(port,()=>{
    console.log(`Server started on ${port}`);
})