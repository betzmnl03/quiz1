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
        let time=[];
        for(let x of records){
            time.push(timeFunc(x.created_at))
        }
        
        res.render('cluck',{records:records,username:username,time:time})
    })
})

router.get('/clucks',(req,res)=>{
    let username=req.cookies.username;
    knex('clucks')
    .orderBy('created_at','desc')
    .then((records)=>{
        let time;
        for(let x of records){
        time=timeFunc(x.created_at)
    }
    
    res.render('cluck',{records:records,username:username,time:time})
    })
})

const timeFunc=(ptime)=>{
    console.log("ptime",ptime)
    let current = new Date();
    var difference = current.getTime() - ptime.getTime();

    var daysDifference = Math.floor(difference/1000/60/60/24);
    difference -= daysDifference*1000*60*60*24

    var hoursDifference = Math.floor(difference/1000/60/60);
    difference -= hoursDifference*1000*60*60

    var minutesDifference = Math.floor(difference/1000/60);
    difference -= minutesDifference*1000*60

    var secondsDifference = Math.floor(difference/1000);

    console.log('difference = ' + 
      daysDifference + ' day/s ' + 
      hoursDifference + ' hour/s ' + 
      minutesDifference + ' minute/s ' + 
      secondsDifference + ' second/s ');

      if(daysDifference===0&&hoursDifference===0&&minutesDifference<=1){
          return "just now"
      }
      else if(daysDifference===0&&hoursDifference===0&&minutesDifference>1){
          return `${minutesDifference} minutes ago`
      }
      else if(daysDifference===0&&hoursDifference>0){
        return `${hoursDifference} hours ago`
    }
    else{
        return `${daysDifference} days ago`
    }

}

module.exports = router;