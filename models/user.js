const { Schema,model } = require('mongoose')


const userSchema = new Schema({
    username:{type:String},
    phone:{type:String,unique:true},
    codeVerify:{type:Number},
    friends:[],
    groups:[]
})


const userModel = model(userSchema,'users')

module.exports = {userModel}