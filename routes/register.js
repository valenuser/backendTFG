const express =  require('express')

const router = express.Router()

const { verifyUserEmail,verifyUsername, RegisterUser, updateCodeValidator} = require('../services/UserServices')

const { registerMail } = require('../services/MailServices')

const cors =  require('cors')

const { corsOptionsDelegate } = require('../app')



/* The code `router.use(cors({methods:['GET','POST']}))` is setting up CORS (Cross-Origin Resource
Sharing) configuration for the router object. It is allowing only GET and POST requests from
specified origins to access the routes defined on this router. This configuration helps in
controlling which HTTP methods are allowed for cross-origin requests, providing an additional layer
of security for the server. */
router.use(cors({methods:['GET','POST']}))




/* This code snippet is defining a POST route on the router object. When a POST request is made to this
route, the provided callback function will be executed. Here's a breakdown of what the code is
doing: */
router.post('/',(cors(corsOptionsDelegate)),async(req,res)=>{

    const { email, username } = req.body
    
    const checkEmail = await verifyUserEmail({email:email})

    const checkUser = await verifyUsername({username:username})
    
    if(checkEmail.length != 0){

        res.status(200).send({errorEmail:'El email ya ha sido registrado.'})

    }else if(checkUser.length != 0){

        res.status(200).send({errorUser:'El nombre de usuario no esta disponible.'})

    }else{

        const register = RegisterUser({email:email,username:username})

        if(register){

            registerMail(email,username)
            
            res.status(200).send({checked:'Ok'})

        }else{
            res.status(200).send({errorRegister:'Ups... hubo un problema al registrarse, vuelva a intentarlo mas tarde'})
        }

    }

})

module.exports = router