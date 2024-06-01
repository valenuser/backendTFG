const { messageModel } = require('../models/message')
const { gptmessageModel } = require('../models/gptMessage')

const saveMessage = async(data) =>{
    try{
        const newMessage = new messageModel({firstUsername:data.firstUsername,secondUsername:data.secondUsername,msg:data.message,date:data.date,hour:data.hour})

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

const deleteMessage = async(user,friend,data) =>{
    try{

        await messageModel.findOneAndDelete({firstUsername:user,secondUsername:friend,date:data.date,msg:data.msg,hour:data.hour})
        
        return true
    }catch(e){
        return false
    }
}
const deletegptMessage = async(user,friend,data) =>{
    try{

        await gptmessageModel.findOneAndDelete({firstUsername:data.firstUsername,secondUsername:data.secondUsername,request:data.request,response:data.response,date:data.date,hour:data.hour})
        
        return true
    }catch(e){
        return false
    }
}



module.exports = {saveMessage,savegptMessage,messagesChat,messagesgptChat, deleteMessage, deletegptMessage}