const express = require('express');
const knex = require('../db/client');
const router = express.Router();


router.get('/form',(req,res)=>{
    let username=req.cookies.username;
    res.render('form',{username:username})
})

router.post('/form',(req,res)=>{
    let username=req.cookies.username;
    knex('clucks')
    .insert({
        username:username,
        content:req.body.content,
        image_url:req.body.image_url
    })
    .returning('*')
    .then((record)=>{
        res.redirect('/')
    })
})

router.get('/',(req,res)=>{
    let username=req.cookies.username;
    knex('clucks')
    .orderBy('created_at','desc')
    .then((records)=>{
        res.render('cluck',{records:records,username:username})
    })
   
})

module.exports = router;