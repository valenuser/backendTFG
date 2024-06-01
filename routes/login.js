const express = require('express')

const router = express.Router()

const cors =  require('cors')

const { corsOptionsDelegate } = require('../app')

const jwt = require('jsonwebtoken')

const { verifyUserEmail,deleteSocket,deleteCodeValidator,userloggead,userdisconnected} = require('../services/UserServices')

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

        res.status(401).send(error)

    }else{

        const { mail, code } = req.body

        const user = await verifyUserEmail({email:mail})


        if(user.length > 0){

            if(user[0]["loggead"] == false){
                
                            if(user[0].code == code){


                                const loggeadState = await userloggead(user[0]["username"])

                                if(loggeadState){

                                    const token = jwt.sign({user:user[0]},process.env.SECRET_TOKEN_CLIENT,{expiresIn:'2h'})
                    
                    
                                    res.status(200).send({token:token})

                                }else{

                                    res.status(401).send({msg:'No se ha podido iniciar sesion correctamente, intentelo de nuevo.'})

                                }

                            }else{
                
                                res.status(401).send({msg:'Codigo invalido.'})
                
                            }
            }else{

                res.status(401).send({msg:'El usuario ya tiene una sesion iniciada'})
            }
        }else{

            res.status(401).send({msg:'Usuario no encontrado'})
        }

    }

})


router.post('/logout',cors(corsOptionsDelegate),[
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
                
                const username = data["user"]["username"];
                const email = data["user"]["email"];

                const updateSocket = await deleteSocket(username)

                if(updateSocket){

                    const updateCode = await deleteCodeValidator({email:email})

                    if(updateCode){

                        const updateStateloggead = await userdisconnected(username)

                        if(updateStateloggead){

                            res.status(200).send()

                        }
                    }else{
                        res.status(401).send({msg:'La sesion no se ha cerrado correctamente.'})
                    }
                }else{

                    res.status(401).send({msg:'La sesion no se ha cerrado correctamente.'})
                }

            }

        }catch(e){

            res.status(401).send({msg:'El token no es valido'})
        }
    }
})


module.exports = router