const { Schema,model } = require('mongoose')
const { type } = require('os')


/* This code snippet is defining a Mongoose schema for a user in a MongoDB database. */
const userSchema = new Schema({
    username:{type:String},
    email:{type:String,unique:true},
    code:{type:Number, default:null},
    firstTime:{type:Boolean,default:true},
    friends:[],
    groups:[]
})


const userModel = model('users',userSchema)

module.exports = {userModel}