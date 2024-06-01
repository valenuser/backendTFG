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


                data["user"]["friends"] = user[0]["friends"]


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

router.post('/verifyTokenChat',cors(corsOptionsDelegate),[
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



                const user = await verifyUsername({username:data["user"][0]["username"]})

                if(user){

                    const friend = await verifyUsername({username:data["friend"][0]["username"]})

                    if(friend){

                        res.status(200).send({user:user[0],friend:friend[0]})
                    }else{

                        res.status(401).send()
                    }
    
    
                }else{

                    res.status(401).send()
                }


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


router.post('/chatToken',cors(corsOptionsDelegate),[
    body('token','Token introducido no valido').exists().isString().isLength({min:150}),
    body('friend','Token introducido no valido').exists().isObject()
],async(req,res)=>{

    const verify = validationResult(req)


    if(verify.isEmpty() == false){
        const error = verify.array()

        res.status(401).send()

    }else{

        
        try{
            const { token, friend } = req.body
            
    
            const verifyToken = jwt.verify(token,process.env.SECRET_TOKEN_CLIENT)

            if(verifyToken){

                const data = jwt.decode(token,process.env.SECRET_TOKEN_CLIENT)


                const user = await verifyUsername({username:data["user"]["username"]})

                if(user){

                    const friendData = await verifyUsername({username:friend["username"]})

                    if(friendData){
                        const newToken = jwt.sign({user:user,friend:friendData},process.env.SECRET_TOKEN_CLIENT,{expiresIn:'2h'})

                        res.status(200).send(newToken)

                    }else{

                        res.status(401).send()

                    }
                }else{

                    res.status(401).send()

                }

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