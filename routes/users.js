const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User.js")

router.get("/", (req, res)=>{
    res.send("user route homepage");
})

//update user
router.put("/:id", async (req, res)=>{

    if(req.body.userId === req.params.id || req.body.isAdmin){
        password_update=false;
        if(req.body.password){
            try{
                const salt=await bcrypt.genSalt(10);
                req.body.password=await bcrypt.hash(req.body.password, salt);
                password_update=true;
            }
            catch(err){
                return res.status(500).json(err);
            }
        }
        try{
            const user=await User.findByIdAndUpdate(req.params.id,{
                $set:req.body
            });
            if(password_update){
                res.status(200).json("Account updated and password changed")
            }
            res.status(200).json("Account has been updated")
        }
        catch(err){
            return res.status(500).json(err);
        }
    }
    else{
        return res.status(400).json("Sorry, you are not authorised to make changes.")
    }

})

//delete user
router.delete("/:id", async (req, res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            const user=await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted")
        }
        catch(err){
            return res.status(500).json(err);
        }
    }
    else{
        return res.status(400).json("Sorry, you are not authorised to make changes.")
    }

})


//get a user
router.get("/:id", async (req, res)=>{
    try{
        const user=await User.findById(req.params.id);
        res.status(200).json(user);
    }
    catch(err){
        res.status(500).json(err)
    }
})


//follow a user
router.put("/:id/follow", async (req, res)=>{
    if(req.body.userId!=req.params.id){
        try{
            const user=await User.findById(req.params.id);
            const currentUser=await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}});
                await currentUser.updateOne({$push:{following:req.params.id }});
                res.status(200).json("You started following"+user.username)
            }
            else{
                res.status(403).json("You already follwo this user.")
            }
        }
        catch(err){
            res.status(500).json(err)
        }
    }
    else{
        res.status(403).json("You can not follow yourself.")
    }
})


//unfollow a user
router.put("/:id/unfollow", async (req, res)=>{
    if(req.body.userId!=req.params.id){
        try{
            const user=await User.findById(req.params.id);
            const currentUser=await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}});
                await currentUser.updateOne({$pull:{following:req.params.id }});
                res.status(200).json("You unfollowed"+user.username)
            }
            else{
                res.status(403).json("You do not follow this user.")
            }
        }
        catch(err){
            res.status(500).json(err)
        }
    }
    else{
        res.status(403).json("You can not unfollow yourself.")
    }
})

module.exports = router