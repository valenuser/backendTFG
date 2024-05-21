const express =  require('express')

const router = express.Router()

const cors =  require('cors')

const jwt = require('jsonwebtoken')

const { corsOptionsDelegate } = require('../app')

const { body, validationResult } = require('express-validator')

router.use(cors({methods:['GET','POST']}))

router.post('/verifyToken',cors(corsOptionsDelegate),[
    body('token','Token introducido no valido').exists().isString().isLength({min:300})
],(req,res)=>{
    const verify = validationResult(req)


    if(verify.isEmpty() == false){
        const error = verify.array()

        res.status(401).send()

    }else{

        
        try{
            const { token } = req.body
            
    
            const verifyToken = jwt.verify(token,process.env.SECRET_TOKEN_CLIENT)

            if(verifyToken){

                const data = jwt.decode(token,process.env.SECRET_TOKEN_CLIENT)

                res.status(200).send(data)

            }else{

                res.status(401).send()
            }
    

        }catch(e){
            res.status(401).send()
        }

    }
})



module.exports = router