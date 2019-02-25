'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var dns = require('dns');
var bodyParser = require('body-parser');


var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;
// bring in bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
/** this project needs a db !! **/ 
//const URI = "mongodb+srv://corny:corny@test-nphga.mongodb.net/test?retryWrites=true";
//URI="mongodb+srv://corny:corny@test-nphga.mongodb.net/test?retryWrites=true"
//console.log(process.env.URI);
mongoose.connect(process.env.URI, { useNewUrlParser: true })
    .then(() => console.log("MongoDB conected ..."))
    .catch(err => console.log(err));; 
// Bring in page
let Page = require('./models/db-pages');


app.use('/public', express.static(process.cwd() + '/public'));
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

// Path and solution
app.post("/api/shorturl/new/", function (req, res) {
  //:usr_url
  //const new_url = req.params.usr_url;
  const new_url = req.body.url;
  let add_val;
  dns.lookup(new_url, (err, address) =>{
    if(!address){
      res.json({error:"invalid URL"});
    }else{
      Page.find({url: new_url}, (err, data)=>{
        if(err)throw err;
        if(data.length==0){
          let page = new Page({
            url: new_url,
          });
          page.save((err, data) => {
            if (err) throw err;
            console.log(data);
            res.json({"original_url": data.url, "short_url":data.index}); // send new page adress
          });
        }else{
          console.log(data);
          res.json({"original_url": data[0].url, "short_url":data[0].index}); // send existing page adress
        }
      });
    }
  });
});
app.get("/api/shorturl/:index", function (req, res) {
  Page.findOne({index: req.params.index}, (err, data)=>{
    //console.log("index: " + req.params.index)
    if(data==null)
    {
      res.send("no such record in db");
    }else { res.redirect("https://www." + data.url);} // redirect to page from database
  })
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});