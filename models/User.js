const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            require: true,
            min:3,
            max:20,
            unique:true
        },
        email:{
            type: String,
            required:true,
            min:6
        },
        password:{
            type:String,
            min: 8,
            max: 32,
            required: true
        },
        profilePicture:{
            type: String,
            default:""
        },
        coverPicture:{
            type: String,
            default:""
        },
        followers:{
            type:Array,
            default:[]
        },
        following:{
            type:Array,
            default:[]
        },
        isAdmin:{
            type: Boolean,
            default: false
        }
    },
    {timestamps: true}
);


module.exports=mongoose.model("User", userSchema);