const express =  require('express')

const router = express.Router()

const cors =  require('cors')

const jwt = require('jsonwebtoken')

const { corsOptionsDelegate } = require('../app')

const { body, validationResult } = require('express-validator')

const { verifyUsername } = require('../services/UserServices')

router.use(cors({methods:['GET','POST']}))

router.post('/verifyToken',cors(corsOptionsDelegate),[
    body('token','Token introducido no valido').exists().isString().isLength({min:150})
],async(req,res)=>{
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

                const user = await verifyUsername({username:data["user"]["username"]})

                console.log(user);

                data["user"]["friends"] = user[0]["friends"]

                console.log(data);

                res.status(200).send(data)

            }else{

                res.status(401).send()
            }
    

        }catch(e){
            console.log(e);
            res.status(401).send()
        }

    }
})
router.post('/addFriendToken',cors(corsOptionsDelegate),[
    body('token','Token introducido no valido').exists().isString().isLength({min:150})
],async(req,res)=>{
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

                console.log(data);

                res.status(200).send(data)

            }else{

                res.status(401).send()
            }
    

        }catch(e){
            console.log(e);
            res.status(401).send()
        }

    }
})



module.exports = router