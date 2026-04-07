const mongoose = require("mongoose")

const userSchema = new mongoose.Schema( {


    username: {
      type: String,
      unique : [true, "Username already exists"],
      required: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    
    password: {
      type: String,
      required: true,
      minlength: [5, "Please enter length of 5 or greater"],
      select: false, // exclude from query results by default
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email already exists"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
     created_at: {
     type: Date,
     default: Date.now
   },
     updated_at: {
     type: Date,
     default: Date.now
  }


})

module.exports = mongoose.model("User", userSchema)