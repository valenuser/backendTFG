const express = require('express')

const router = express.Router()

const cors =  require('cors')

const { corsOptionsDelegate } = require('../app')

const { verifyUserEmail,verifyUsername, RegisterUser, updateCodeValidator} = require('../services/UserServices')

const { body, validationResult} = require('express-validator')

/* The code `router.use(cors({methods:['GET','POST']}))` is setting up CORS (Cross-Origin Resource
Sharing) middleware for the Express router. It allows only GET and POST requests from specified
origins to access the routes defined in the router. This helps in controlling access to resources on
the server from different domains or origins. */
router.use(cors({methods:['GET','POST']}))


router.post('/',cors(corsOptionsDelegate),[
    body('mail','Introduce un mail valido.').exists().isEmail(),
    body('code','Introduce un codigo valido.').exists().isLength({max:9,min:9})
],async(req,res)=>{

    const verify = validationResult(req)

    if(!verify.isEmpty()){

        const error = verify.array()

        res.sendStatus(301).send(error)

    }else{

        const { mail, code } = req.body

        const user = await verifyUserEmail({mail:mail})

        if(user != null){
            if(user.code == code){
                const jwt = jwt.sign({user:user},process.env.SECRET_TOKEN_CLIENT)

                res.sendStatus(200).send({token:jwt})

            }else{

                res.sendStatus(200).send({msg:'Codigo invalido.'})

            }
        }else{

            res.sendStatus(200).send({msg:'Usuario no encontrado'})
        }

    }

})





module.exports = router