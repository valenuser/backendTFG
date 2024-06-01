const { Schema,model } = require('mongoose')



/* This code snippet is defining a Mongoose schema for a user in a MongoDB database. */
const messageSchema = new Schema({
    firstUsername:{type:String},
    secondUsername:{type:String},
    msg:{type:String, default:null},
    date:{type:String},
    hour:{type:String}
})


const messageModel = model('messages',messageSchema)

module.exports = {messageModel}