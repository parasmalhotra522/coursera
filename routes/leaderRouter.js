const express = require('express');
const bodyParser = require('body-parser');
const leader_router = express.Router();

var mongoose = require('mongoose');
var Leaders = require('../models/leaders');
var authenticate = require('../authenticate');

leader_router.use(bodyParser.json());
leader_router.route('/')
.get((req,resp,next)=>{
    Leaders.find({})
    .then((leaders)=>{
        console.log("Retrieved all the leaders Successfully...");
        resp.statusCode = 200;
        resp.statusMessage = "Yoooh";
        resp.setHeader('Content-Type','application/json');
        resp.json(leaders);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin,(req,resp,next)=>{
    Leaders.create(req.body)
    .then((leader)=>{
        console.log(" Created leader Successfully... \n" + req.body);
        resp.statusCode = 200;
        resp.statusMessage = "Yoooh!!! Created Successfully";
        resp.setHeader('Content-Type','application/json');
        resp.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(authenticate.verifyUser,(req,resp,next)=>{
    resp.statusCode = 403; // not supporting
    resp.end('Put Operation not Supported');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin,(req,resp,next)=>{
    Leaders.deleteMany({})
    .then((leaders)=>{
        console.log("Deleted all the leaders Successfully...");
        
        resp.statusCode = 200;
        resp.statusMessage = "This is only for Admins";
        resp.setHeader('Content-Type','application/json');
        resp.json(leaders);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

leader_router.route('/:LeadId')
.get((req, resp, next)=>{
    Leaders.findById(req.params.LeadId)
    .then((leader)=>{
        console.log(`Retrieved the leader with id
        :${req.params.LeadId} With Data:\n${leader}`);
        
        resp.statusCode = 200;
        resp.statusMessage = "Buraah!! the data retrievd for "+req.params.LeadId;
        resp.setHeader('Content-Type','application/json');
        resp.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err)); 
})
.post(authenticate.verifyUser,(req, resp, next)=>{
    resp.statusCode = 403;
    resp.end(`Post Operation Not Supported\n Status Code:${resp.statusCode}`);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin,(req,resp,next)=>{
    Leaders.findByIdAndUpdate(req.params.LeadId,
        {$set : req.body})
    .then((leader)=>{
        console.log(`Leader with id : 
        ${req.params.LeadId} Updated Successfuly
         \n ${leader}`);
       
        resp.statusCode = 200;
        resp.statusMessage = "Buraah!! Updated for "+req.params.LeadId;
        resp.setHeader('Content-Type','application/json');
        resp.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err)); 
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin,(req,resp,next)=>{
    
    Leaders.findByIdAndRemove(req.params.LeadId)
    .then((leader)=>{
        console.log(`Leader with id removed successfully : ${req.params.LeadId}\n ${leader}`);
        resp.statusCode = 200;
        resp.setHeader('Content-Type','application/json');
        resp.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err));
 });

module.exports=leader_router;
