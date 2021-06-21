
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { model } = require("mongoose");

router.post("/register", async (req, res)=>{
  try{
    
    //generate new password
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const user = await new User({
    username:req.body.username,
    email:req.body.email,
    password:hashedPassword
    });

    //save user
    await user.save();

  }
  catch(err){
    console.log(err);
    if(err.code==11000){
      res.send("Choose unique fields");
    }
  }
  //reponse
  res.send("ok")
});

//Log In
router.post("/login", async (req, res)=>{
  try{
    const user=await User.findOne({email:req.body.email});
    !user&&res.status(404).json("user not found");
  
    const validPassword=await bcrypt.compare(req.body.password, user.password);
    !validPassword&&res.status(404).json("wrong username password combination");
  
    res.status(200).json(user);
  }
  catch(err){
    res.status(500).json(err);
  }
  
})



module.exports = router;