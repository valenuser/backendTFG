const { messageModel } = require('../models/message')


const saveMessage = async(data) =>{
    try{
        const newMessage = new messageModel({firstUsername:data.firstUsername,secondUsername:data.secondUsername,message:data.message,date:data.date,hour:data.hour})

        await newMessage.save()
    
        return true
    }catch(e){
        return false
    }
} 



module.exports = {saveMessage}