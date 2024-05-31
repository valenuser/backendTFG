const { messageModel } = require('../models/message')
const { gptmessageModel } = require('../models/gptMessage')

const saveMessage = async(data) =>{
    try{
        const newMessage = new messageModel({firstUsername:data.firstUsername,secondUsername:data.secondUsername,message:data.message,date:data.date,hour:data.hour})

        console.log(newMessage);

        await newMessage.save()
    
        return true
    }catch(e){
        console.log(e);
        return false
    }
} 

const savegptMessage = async(data) =>{
    try{
        const newMessage = new gptmessageModel({firstUsername:data.firstUsername,secondUsername:data.secondUsername,request:data.request,response:data.response,date:data.date,hour:data.hour})

        console.log(newMessage);

        await newMessage.save()
    
        return true
    }catch(e){
        console.log(e);
        return false
    }
} 

const messagesChat = async(data) =>{
    try{
        const messages = await messageModel.find({$or:[{firstUsername:data.firstUsername,secondUsername:data.secondUsername},{firstUsername:data.secondUsername,secondUsername:data.firstUsername}]})

        return messages
        
    }catch(e){
        console.log(e);
        return false
    }
} 
const messagesgptChat = async(data) =>{
    try{
        const messages = await gptmessageModel.find({firstUsername:data.firstUsername,secondUsername:data.secondUsername})

        return messages

    }catch(e){
        console.log(e);
        return false
    }
} 



module.exports = {saveMessage,savegptMessage,messagesChat,messagesgptChat}