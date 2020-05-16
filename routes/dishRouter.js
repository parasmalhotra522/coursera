const express = require('express');
const bodyParser = require('body-parser');
const dishRouter = express.Router();

const mongoose = require('mongoose');
const Dishes = require('../models/dishes'); // importing the dishes schema
var authenticate = require('../authenticate');

dishRouter.use(bodyParser.json());
dishRouter.route('/')
.get((req,resp,next)=>{ // get request is to fetch the data
    Dishes.find({})
    .populate('comments.author')
    .then((dishes)=>{
        resp.statusCode = 200,
        resp.setHeader('Content-Type' , 'application/json'),
        resp.json(dishes);
    }, (err) => next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req,resp,next)=>{
   // posting means that we already have data in the params or the
   // request.body 
   Dishes.create(req.body)
   .then((dish)=>{
       console.log("Dish Created Successfully:\n", dish);
       resp.statusCode = 200,
       resp.setHeader('Content-Type','application/json'),
       resp.json(dish);
   }, (err)=>next(err))
   .catch((err)=>next(err));
})

.put(authenticate.verifyUser,(req,resp,next)=>{
    resp.statusCode = 403; // not supporting
    resp.end('Put Operation not Supported');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,resp,next)=>{
    //this is dangerous operation as this must only be given to 
    // the admins
    Dishes.deleteMany({})
    .then((resp)=>{
        console.log("Deleted Successfully",dishes);
        resp.statusCode = 200;
        resp.setHeader('Content-Type','application/json'),
        resp.json(dish);

    },(err)=>next(err))
    .catch((err)=>next(err));
});

dishRouter.route('/:dishId')
.get((req, resp, next)=>{
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish)=>{
        console.log(`Dish Retrieved Successfully with id : ${req.params.dishId}\n ${dish}`);
        resp.statusCode = 200;
        resp.setHeader('Content-Type','application/json');
        resp.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req, resp, next)=>{
    resp.statusCode = 403;
    resp.end(`Post Operation Not Supported\n Status Code:${resp.statusCode}`);

})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,resp,next) => {
     
    Dishes.findByIdAndUpdate(req.params.dishId, {$set : req.body})
    .then((dish)=>{
        console.log(`Dish with id : ${req.params.dishId} Updated Successfuly \n ${dish}`);
        resp.statusCode = 200;
        resp.setHeader('Content-Type','application/json');
        resp.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req,resp,next)=>{
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((dish)=>{
        console.log(`Dish with id removed successfully : ${req.params.dishId}\n ${dish}`);
        resp.statusCode = 200;
        resp.setHeader('Content-Type','application/json');
        resp.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

// dishes/dishid/comments
dishRouter.route('/:dishId/comments')
.get((req, resp, next)=>{
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish)=>{
        if(dish!=null){
            resp.statusCode = 200;
            resp.setHeader('Content-Type','application/json');
            resp.json(dish.comments);
            }
        else{
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return  next(err);

        }
        },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req, resp, next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish!=null){
            req.body.author = req.user._id;
            dish.comments.push(req.body);
            dish.save()
            .then((dish)=>{

                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish)=>{
                    resp.statusCode = 200;
                    resp.setHeader('Content-Type','application/json');
                    resp.json(dish.comments);
               
                })
                 },(err)=>next(err));
        }
        else{
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return  next(err);
        }
        },(err)=>next(err))
    .catch((err)=>next(err));

})
.put(authenticate.verifyUser,(req,resp,next)=>{
    resp.statusCode = 403;
    resp.write("Put Operation not supported on /dishid"+req.params.dishId+"/comments");
    console.log("Put Operation not supported on /dishid"+req.params.dishId+"/comments");
})
.delete(authenticate.verifyUser,(req,resp,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish!=null){
            for(var i =(dish.comments.length - 1);i>=0;i--){
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save()
            .then((dish)=>{
                resp.statusCode= 200;
                resp.setHeader('Content-Type','application/json');
                resp.json(dish);
            }, (err)=>next(err));
        }
        else{
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return  next(err);
        }
        },(err)=>next(err))
});
 
// dishes/dishid/comment/commentId
dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId
        + '/comments/' + req.params.commentId);
})
.put(authenticate.verifyUser,(req, res, next) => {

    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if ( dish != null && dish.comments.id(req.params.commentId) != null
        && dish.comments.id(req.params.commentId).author.equals(req.user._id)) {
            if (req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }

            if (req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment;                
            }

            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);                
                
                })
                }, (err) => next(err));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null
            && dish.comments.id(req.params.commentId).author.equals(req.user._id)) {
            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);                
                
                },(err)=>next(err))                
            }, (err) => next(err))
            .catch((err)=>next(err));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports=dishRouter;

