const express = require('express')

const router =  express.Router()

const cors =  require('cors')

const jwt = require('jsonwebtoken')

const { corsOptionsDelegate } = require('../app')

const { body, validationResult } = require('express-validator')


const { messageGpt } = require('../services/GptServices')

router.use(cors({methods:['GET','POST']}))

router.post('/messageGpt',cors(corsOptionsDelegate),[
    body('message','La pregunta no esta bien formulada.').exists().isObject(),
    body('token','Token introducido no valido').exists().isString().isLength({min:150})
],async(req,res)=>{
    const verify = validationResult(req)

    if(verify.isEmpty() == false){
        const error = verify.array()

        res.status(401).send(error)

    }else{
        const { message,token } = req.body     

        try{
            const verifyToken = jwt.verify(token,process.env.SECRET_TOKEN_CLIENT)

            if(verifyToken){
            
                const gptRequest = await messageGpt(message["message"])
        
        
                if(gptRequest != false){
                    console.log(gptRequest["choices"][0]["message"]["content"]);

                    const reponse = gptRequest["choices"][0]["message"]["content"]
        
                    res.status(200).send({message:message,response:reponse})
                }else{
                    res.status(401).send({msg:'Error al conectar con chatgpt.'})
                }
            }
        }catch(e){
            res.status(401).send({msg:'El token no es valido'})
        }
    }
})


module.exports = router