const express = require('express');
const { indexOf } = require('lodash');
const knex = require('../db/client');
const router = express.Router();


router.get('/form',(req,res)=>{
    let username=req.cookies.username;
    res.render('form',{username:username})
})


router.post('/form',(req,res)=>{
    let username=req.cookies.username;
    let trendArr=[]
    let rec=[]
    let final=[];
    if(req.body.content.includes("#")){
        let contentArr=req.body.content.split(" ")
        for(let x of contentArr){
            if(x.includes("#")){
                trendArr.push(x)
            }
        }
        for(let x of trendArr){
            knex('trending')
    .select('*')
    .where('trend','like', x)
    .then((record)=>{
        if(record.length===0){
            knex('trending')
            .insert({
                trend:`${x}`,
                count:1
            })
            .returning("*")
            .then(()=>{
                return "inserted new trend"
            })
        }
        else{
            let count=record[0].count+1;
            knex('trending')
            .where('trend','ilike',x)
            .update({
                count:count
            })
            .returning('*')
            .then((record)=>{
               console.log(record)
            })
        }
        })
        }
    }
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
    let final=[]
    let username=req.cookies.username;
    knex('clucks')
    .orderBy('created_at','desc')
    .then((records)=>{
        let time=[];
        for(let x of records){
            time.push(timeFunc(x.created_at))
        }
        knex('trending')
        .select('*')
        .orderBy('count','desc')
        .returning('*')
        .then((record)=>{
            final.push(record)
        })
        .then(()=>{
            if(final.length>0){
                
                res.render('cluck',{records:records,username:username,time:time,final:final})
            }
            else{
                res.render('cluck',{records:records,username:username,time:time,final:false})
            }
            
        })

    })
})

router.get('/clucks',(req,res)=>{
    let username=req.cookies.username;
    let final=[]
    knex('clucks')
    .orderBy('created_at','desc')
    .then((records)=>{
        let time=[];
        for(let x of records){
            time.push(timeFunc(x.created_at))
        }
        knex('trending')
        .select('*')
        .orderBy('count','desc')
        .returning('*')
        .then((record)=>{
            final.push(record)
        })
        .then(()=>{
            if(final.length>0){
                
                res.render('cluck',{records:records,username:username,time:time,final:final})
            }
            else{
                res.render('cluck',{records:records,username:username,time:time,final:false})
            }
            
        })

    })
})


const timeFunc=(ptime)=>{

    let current = new Date();
    let difference = current.getTime() - ptime.getTime();

    let daysDifference = Math.floor(difference/1000/60/60/24);
    difference -= daysDifference*1000*60*60*24

    let hoursDifference = Math.floor(difference/1000/60/60);
    difference -= hoursDifference*1000*60*60

    let minutesDifference = Math.floor(difference/1000/60);
    difference -= minutesDifference*1000*60

    let secondsDifference = Math.floor(difference/1000);

      if(daysDifference===0&&hoursDifference===0&&minutesDifference<=1){
          return "just now"
      }
      else if(daysDifference===0&&hoursDifference===0&&minutesDifference>1){
          return `${minutesDifference} minutes ago`
      }
      else if(daysDifference===0&&hoursDifference>0){
        return hoursDifference===1?'1 hour ago':`${hoursDifference} hours ago`
    }
    else{
        return DaysDifference===1?'1 day ago':`${daysDifference} days ago`
    }

}


module.exports = router;