const { Schema,model } = require('mongoose')



/* This code snippet is defining a Mongoose schema for a user in a MongoDB database. */
const gptMessageSchema = new Schema({
    firstUsername:{type:String},
    secondUsername:{type:String},
    request:{type:String},
    response:{type:String},
    date:{type:String},
    hour:{type:String}
})


const gptmessageModel = model('gptmessage',gptMessageSchema)

module.exports = {gptmessageModel}