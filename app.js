//jshint esversion:6
require ('dotenv').config()
const express = require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose")
const mongodb=require('mongodb')
const encrypt=require("mongoose-encryption")
const app=express();

app.use(express.static("public"))
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect("mongodb://0.0.0.0:27017/UserDB")
.then(()=>{
    console.log('mongodb connected')
})
.catch(()=>{
    console.log('error')
})

const UserSchema=new mongoose.Schema({
    email:String,
    password:String

});
console.log(process.env.API_KEY)
UserSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']});
//it will encrpyt when called and dencrypt during the find method call
const User=mongoose.model("User",UserSchema);
app.get("/",function(req,res){
    res.render("home.ejs")
})
app.get("/login",function(req,res){
    res.render("login.ejs")
})
app.get("/register",function(req,res){
    res.render("register.ejs")
})
app.post("/register",function(req,res){
    const NewUser=new User({
        email:req.body["username"],
        password:req.body["password"]
    })
    console.log(NewUser.email)
    console.log(NewUser.password)
    NewUser.save()
    res.render("secrets.ejs")
    
})
app.post("/login",function(req,res){
    var username_ret=req.body["username"]
    var password_ret=req.body["password"]
    User.findOne({email:username_ret})
        .then((FoundUser)=>{
            if(FoundUser.password===password_ret)
            {
                res.render("secrets.ejs")
            }
        })
        .catch((err)=>{
            console.log(err)
        })
        
    })
app.listen(3000,function(){
    console.log("website started on the port 3000")
})
