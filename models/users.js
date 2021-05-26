const mongoose=require('mongoose')
const validator=require('validator')
const user=mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    name:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required:true,
        validate:{
                validator : (value) =>{
                    return validator.isEmail(value)
                },
                message : "Provide a valid email"
            }
    },
    gender:{
        type: String,
        required: true
    },
    isProfilePic:{
        type: Boolean,
        required: true
    },
    imgLocation:{
        type: String
    },
    profileMade:{
        type : Date,
        default : new Date()
    }
})

user.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
   }
module.exports=mongoose.model('User',user)