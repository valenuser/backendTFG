const express = require('express')

const router = express.Router()

const cors =  require('cors')

const { corsOptionsDelegate } = require('../app')

const jwt = require('jsonwebtoken')

const { verifyUserEmail, RegisterUser, updateCodeValidator} = require('../services/UserServices')

const { body, validationResult} = require('express-validator')

/* The code `router.use(cors({methods:['GET','POST']}))` is setting up CORS (Cross-Origin Resource
Sharing) middleware for the Express router. It allows only GET and POST requests from specified
origins to access the routes defined in the router. This helps in controlling access to resources on
the server from different domains or origins. */
router.use(cors({methods:['GET','POST']}))


router.post('/',cors(corsOptionsDelegate),[
    body('mail','Introduce un mail valido.').exists().isEmail(),
    body('code','Introduce un codigo valido.').exists().isLength({max:6,min:6})
],async(req,res)=>{

    const verify = validationResult(req)

    if(verify.isEmpty() === false){

        const error = verify.array()

        return res.status(401).send(error)

    }else{

        const { mail, code } = req.body

        const user = await verifyUserEmail({email:mail})


        if(user.length > 0){

            if(user[0].code == code){
                const token = jwt.sign({user:user[0]},process.env.SECRET_TOKEN_CLIENT)


                return res.status(200).send({token:token})

            }else{

                return res.status(401).send({msg:'Codigo invalido.'})

            }
        }else{

            return res.status(401).send({msg:'Usuario no encontrado'})
        }

    }

})





module.exports = router