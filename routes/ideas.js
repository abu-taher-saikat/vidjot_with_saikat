const express = require('express');
const router = express.Router();
// requring Idea model
const Idea = require('./../models/Idea');

// Idea index page
router.get('/',(req, res)=>{
    Idea.find({})
    .sort({date : 'desc'})
    .then(ideas =>{
        res.render('ideas/index',{
            ideas : ideas
        })
    })
})

// Add idea form
router.get('/add',(req, res)=>{
    res.render('ideas/add');
});


// Edit idea form
router.get('/edit/:id', (req,res)=>{
    Idea.findOne({_id : req.params.id})
    .then(idea =>{
        res.render('ideas/edit',{
            idea : idea
        })
    });
});

// process Form
router.post('/',(req, res)=>{
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
router.put('/:id',(req, res)=>{
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
router.delete('/:id',(req, res)=>{
    // res.send('delete)
    Idea.deleteOne({_id: req.params.id})
    .then(()=>{
        req.flash('success_msg',"Video idea removed");
        res.redirect('/ideas');
    })
})


module.exports = router;