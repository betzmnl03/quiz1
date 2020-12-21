const express = require('express');
// const knex = require('../db/client');
const router = express.Router();


router.get('/signin',(req,res)=>{
    res.render('new',{username:false})
})

router.get('/signout',(req,res)=>{
    res.clearCookie('username')
    res.redirect('/user/signin')
})

router.get('',(req,res)=>{
    // console.log(req.cookies)
    let username=req.cookies.username
    console.log(username)
    res.render('cluck',{username:username})
})

router.use((req,res,next)=>{
    const username = req.cookies.username;    
    res.locals.username=""
    //local will change the variable the global variable
    if(username){
      res.locals.username = username;
      console.log(`Signed in as ${username}`);
    }
    next();
  })


router.post('/signin',(req,res)=>{
    const COOKIE_EXPIRE = 1000 * 60 * 60 * 24 * 7;
    const username = req.body.username; 
    res.cookie('username', username, { maxAge: COOKIE_EXPIRE });
    res.redirect('/form')
})

router.get('/form',(req,res)=>{
    res.render('form')
})










module.exports = router;