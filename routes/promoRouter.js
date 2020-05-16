const express = require('express');
const bodyParser = require('body-parser');
const PromoRouter = express.Router();

const mongoose = require('mongoose');
const Promotions = require('../models/promotions');
var authenticate = require('../authenticate');
// using this router we neednot write all crud operations for particular .html page
// we can simply use one express router and all the functions will be configured for all the
// routes wee are not putting any semicolon as they are a;ll being chained
// together it means all crud for dishrouter is implemnted as one



PromoRouter.use(bodyParser.json());
PromoRouter.route('/')

.get((req,resp,next)=>{
    Promotions.find({})
    .then((promotions)=>{
        resp.statusCode = 200;
        resp.setHeader('Content-Type','application/json');
        resp.json(promotions);
    }, (err)=>next(err))
    .catch((err)=>next(err));
})

.post(authenticate.verifyUser, authenticate.verifyAdmin,(req,resp,next)=>{
    Promotions.create(req.body)
    .then((promotion)=>{
        console.log("Promotion Created Sucessfully...\n"+ promotion);
        resp.statusCode = 200,
        resp.setHeader('Content-Type','application/json')
        resp.json(promotion);
    }, (err)=> next(err))
    .catch((err)=>next(err));
})
.put(authenticate.verifyUser,(req,resp,next)=>{
    resp.statusCode = 403; // not supporting
    resp.end('Put Operation not Supported');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin,(req,resp,next)=>{
    Promotions.deleteMany({})
    .then((promotion)=>{
        console.log("Deleted all the promotions:\n"
        + promotion);

        resp.statusCode = 200;
        resp.setHeader('Content-Type','application/json');
        resp.json(promotion);
    }, (err)=>next(err))
    .catch((err)=>next(err));
});

PromoRouter.route('/:promoId')
.get((req, resp, next)=>{
    Promotions.findById(req.params.promoId)
    .then((promotion)=>{
        console.log(`Promotion with Id :
        ${req.params.promoId} retrieved with \n
        data : \t ${promotion}`);

        resp.statusCode = 200;
        resp.setHeader('Content-Type','application/json');
        resp.json(promotion);
    }, (err)=>next(err))
    .catch((err)=>next(err));    
})
.post(authenticate.verifyUser,(req, resp, next)=>{
    resp.statusCode = 403;
    resp.end(`Post Operation Not Supported\n Status Code:${resp.statusCode}`);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin,(req,resp,next)=>{
    Promotions.findByIdAndUpdate(req.params.promoId,
        {$set : req.body })
    .then((promotion)=>{
        console.log(`Updated the id : ${req.params.promoId} Successfully`);
        resp.statusCode = 200;
        resp.statusMessage = "Updated..xx";
        resp.setHeader('Content-Type','application/json');
        resp.json(promotion);
    },((err)=>next(err)))
    .catch((err)=>next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin,(req,resp,next)=>{
    Promotions.findByIdAndDelete(req.params.promoId)
    .then((promotion)=>{
        console.log(`Deleted the dish with id ${req.params.promoId} Successfully`);
        resp.statusCode = 200;
        resp.setHeader('Content-Type','application/json');
        resp.json(promotion);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

module.exports=PromoRouter;
