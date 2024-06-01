const express = require('express')

const router =  express.Router()

const cors =  require('cors')

const jwt = require('jsonwebtoken')

const { corsOptionsDelegate } = require('../app')

const { body, validationResult } = require('express-validator')

const { searchUsers} = require('../services/UserServices')


router.use(cors({methods:['GET','POST']}))


router.post('/',cors(corsOptionsDelegate),[
    body('token','Token introducido no valido.').exists().isString().isLength({min:300},
    body('username','Nombre de contacto mal escrito.').exists()
    )
],async (req,res)=>{

    const verify = validationResult(req)

    console.log(verify);
    if(verify.isEmpty() == false){
        const error = verify.array()

        res.status(401).send(error)

    }else{

        const { token,username } = req.body            
    
        const verifyToken = jwt.verify(token,process.env.SECRET_TOKEN_CLIENT)

        if(verifyToken){

            if(username == ""){
                res.status(200).send({users:[]})
            }else{

                const data = jwt.decode(token,process.env.SECRET_TOKEN_CLIENT)
            
                const users = await searchUsers(username)
                
                if(users == 500){
                
                    res.status(500).send()
                
                }else{
    
    
                    const usersList = users.filter(x => x.username != data["user"]["username"])
    
                    console.log(usersList);
                
                    res.status(200).send({users:usersList})
                }
            
            }

        }else{

            res.status(401).send({msg:'Token introducido no valido.'})

        }
    }
})


module.exports = router