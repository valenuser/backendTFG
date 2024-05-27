const express = require('express')

const router = express.Router()

const jwt = require('jsonwebtoken')

const cors =  require('cors')

const { corsOptionsDelegate} = require('../app')

const { verifyUserEmail, RegisterUser, updateCodeValidator} = require('../services/UserServices')

const { loginMail } = require('../services/MailServices')



/* The code `router.use(cors({methods:['GET','POST']}))` is setting up CORS (Cross-Origin Resource
Sharing) middleware for the Express router. It allows only GET and POST requests from specified
origins to access the routes defined in the router. This helps in controlling access to resources on
the server from different domains or origins. */
router.use(cors({methods:['GET','POST']}))


/* This code snippet defines a GET route at the '/verify' endpoint in the Express router. When a GET
request is made to this endpoint, it generates a JSON Web Token (JWT) using the `jsonwebtoken`
library. The token is signed with a payload containing a 'verify' property set to true and a secret
key 'secret'. Finally, it sends a JSON response back to the client containing the generated token in
the 'token' property. */
router.get('/verify',(cors(corsOptionsDelegate)),(req,res)=>{
    const token = jwt.sign({verify:true},'secret')
    res.json({'token':token})
})


/* This code snippet defines a POST route at '/verifyMail' endpoint in the Express router. When a POST
request is made to this endpoint, it expects a request body containing a 'mail' property. */
router.post('/verifyMail',(cors(corsOptionsDelegate)),async(req,res)=>{
    const {mail} = req.body

    const code = Math.floor(Math.random()*1000000)

    while(code.length < 6){
        const code = Math.floor(Math.random()*1000000)
    }

    const user = await verifyUserEmail({email:mail})

    console.log(user);
    if(user.length != 0){
        const statusMail =  loginMail(mail,code,user[0].username)
    
        if(statusMail){
    
            const updateCodeUser = await updateCodeValidator({mail:mail,code:code})
    
            if(updateCodeUser){
    
                res.status(200).send('Ok')
    
            }else{

                res.status(401).send({msg:'Ups... hubo un problema interno, vuelva a intentarlo mas tarde.'})
            }
    
        }else{
            res.status(404).send({msg:'No se ha podido enviar el mail, intentelo mas tarde.'})
        }

    }else{
        res.status(401).send({msg:'Usuario no encontrado.'})
    }

})


module.exports = router