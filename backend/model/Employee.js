const mongoose = require("mongoose")

const empSchema = new mongoose.Schema({


   first_name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    
    last_name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    

     email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        default: 'Other',

    },

    designation : {
        type: String,
        required:true,
        minlength: 2,
        maxlength: 50,
     
    },
    salary:{
        type:Number,
        required:true,
        min:0,

    },
    date_of_joining:{
        type: Date,
        default: Date.now
    } ,
    department:{
        type: String,
        lowercase: true,
        trim: true,
        required:true,
        minlength: 2,
        maxlength: 50,
    },
     created_at: {
        type: Date,
        default: Date.now
   },
     updated_at: {
        type: Date,
        default: Date.now
  },
//   image: {
//         type: String,  
//         default: null,
//     },

})

module.exports = mongoose.model("Employee" , empSchema)