const express = require('express')

const router = express.Router()

const cors =  require('cors')

const jwt = require('jsonwebtoken')

const { corsOptionsDelegate } = require('../app')

const { body, validationResult } = require('express-validator')


const { saveMessage,savegptMessage,messagesChat,messagesgptChat } = require('../services/MessageServices')


router.use(cors({methods:['GET','POST']}))


router.post('/saveMessage',cors(corsOptionsDelegate),[
    body('token','Token introducido no valido').exists().isString().isLength({min:150}),
    body('message','No se ha podido guardar el mensaje.').exists().isObject()
],async(req,res)=>{
    const verify = validationResult(req)

    if(verify.isEmpty() == false){
        const error = verify.array()

        res.status(401).send(error)

    }else{
        const { token, message } = req.body            
        try{
            const verifyToken = jwt.verify(token,process.env.SECRET_TOKEN_CLIENT)
    
            if(verifyToken){
    
                const data = jwt.decode(token,process.env.SECRET_TOKEN_CLIENT)

                const user =  data["user"][0]["username"]
                const friend =  data["friend"][0]["username"]

                const saveData =  await saveMessage({firstUsername:user,secondUsername:friend,message:message["msg"],date:message["date"],hour:message["hour"]})

                if(saveData){

                    res.status(200).send()

                }else{
                    res.status(404).send({msg:'No se ha podido guardar el mensaje'})
                }
            }
        }catch(e){
            console.log(e);
            res.status(404).send({msg:'No se ha podido guardar el mensaje'})
        }
    }
})
router.post('/savegptMessage',cors(corsOptionsDelegate),[
    body('token','Token introducido no valido').exists().isString().isLength({min:150}),
    body('message','No se ha podido guardar el mensaje.').exists().isObject()
],async(req,res)=>{
    const verify = validationResult(req)

    if(verify.isEmpty() == false){
        const error = verify.array()

        res.status(401).send(error)

    }else{
        const { token, message } = req.body            
        try{
            const verifyToken = jwt.verify(token,process.env.SECRET_TOKEN_CLIENT)
    
            if(verifyToken){
    
                const data = jwt.decode(token,process.env.SECRET_TOKEN_CLIENT)

                const user =  data["user"][0]["username"]
                const friend =  data["friend"][0]["username"]

                // console.log(message["message"]["message"],message["response"]);
                // res.status(200).send()

                const saveData =  await savegptMessage({firstUsername:user,secondUsername:friend,request:message["message"]["message"],response:message["response"],date:message["message"]["date"],hour:message["message"]["hour"]})

                if(saveData){

                    res.status(200).send()

                }else{
                    res.status(404).send({msg:'No se ha podido guardar el mensaje'})
                }
            }
        }catch(e){
            console.log(e);
            res.status(404).send({msg:'No se ha podido guardar el mensaje'})
        }
    }
})

router.post('/messagesChat',cors(corsOptionsDelegate),[
    body('token','Token introducido no valido').exists().isString().isLength({min:150}),
],async(req,res)=>{
    const verify = validationResult(req)

    if(verify.isEmpty() == false){
        const error = verify.array()

        res.status(401).send(error)

    }else{
        const { token } = req.body            
        try{
            const verifyToken = jwt.verify(token,process.env.SECRET_TOKEN_CLIENT)
    
            if(verifyToken){
    
                const data = jwt.decode(token,process.env.SECRET_TOKEN_CLIENT)

                const user =  data["user"][0]["username"]
                const friend =  data["friend"][0]["username"]

                // console.log(message["message"]["message"],message["response"]);
                // res.status(200).send()

                const messages =  await messagesChat({firstUsername:user,secondUsername:friend})


                if(messages != false){

                    const messagesGpt =  await messagesgptChat({firstUsername:user,secondUsername:friend})

                    console.log(messages,messagesGpt);
                    if(messagesGpt){
                        res.status(200).send({messagesUsers:messages,gpt:messagesGpt})
                    }


                }else{
                    res.status(404).send({msg:'No se han podido cargar los mensajes'})
                }
            }
        }catch(e){
            console.log(e);
            res.status(404).send({msg:'No se ha podido guardar el mensaje'})
        }
    }
})



module.exports = router