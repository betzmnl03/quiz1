const express = require('express');
const knex = require('../db/client');
const router = express.Router();


router.get('/form',(req,res)=>{
    let username=req.cookies.username;
    res.render('form',{username:username})
})

router.post('/form',(req,res)=>{
    let username=req.cookies.username;
    res.render('form',{username:username})
})

module.exports = router;