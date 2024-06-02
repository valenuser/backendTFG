const express = require('express')

const router = express.Router()

const cors =  require('cors')

const jwt = require('jsonwebtoken')

const { corsOptionsDelegate } = require('../app')

const { body, validationResult } = require('express-validator')

const { verifyUserEmail, verifyUsername, addFriend, userAddFriendData,deleteFriend  } = require('../services/UserServices')

const { newFriendMail } = require('../services/MailServices')

const { saveMessage } = require('../services/MessageServices')


router.use(cors({methods:['GET','POST']}))


router.post('/add',cors(corsOptionsDelegate),[
    body('email','Introduce un mail valido.').exists().isEmail(),
    body('token','Token introducido no valido').exists().isString().isLength({min:150})
],async(req,res)=>{

    const verify = validationResult(req)

    if(verify.isEmpty() == false){
        const error = verify.array()

        res.status(401).send(error)

    }else{
        const { token,email } = req.body            
    
        const verifyToken = jwt.verify(token,process.env.SECRET_TOKEN_CLIENT)

        if(verifyToken){

            const data = jwt.decode(token,process.env.SECRET_TOKEN_CLIENT)


            const user = await verifyUserEmail({email:email})

            if(user !== false){

                const newToken = jwt.sign({user:user[0], friend:data["user"]},process.env.SECRET_TOKEN_CLIENT,{ algorithm: 'HS256' })

                const url =`http://192.168.1.11:8080/newFriend/${newToken}`


                const sendEmail = newFriendMail(user[0]["email"],user[0]["username"],data["user"]["username"],url)

                if(sendEmail == true){

                    res.status(200).send()
                }else{
                    res.status(404).send({msg:'No se ha podido enviar la notificación al usuario, intentelo mas tarde.'})
                }

            }else{
                res.status(404).send({msg:'Usuario no encontrado'})
            }
        }
    }
})


router.post('/addFriend',cors(corsOptionsDelegate),[
    body('token','Token introducido no valido').exists().isString().isLength({min:150})
],async(req,res)=>{
    const verify = validationResult(req)

    if(verify.isEmpty() == false){
        const error = verify.array()

        res.status(401).send(error)

    }else{
        const { token } = req.body            
        try{
            const verifyToken = jwt.verify(token,process.env.SECRET_TOKEN_CLIENT)
    
            if(verifyToken){
    
                const data = jwt.decode(token,process.env.SECRET_TOKEN_CLIENT)
                
                const user = data["user"]
                const friend = data["friend"]
                
                console.log(user);
                console.log(friend);

                const userList = user["friends"]
    

                const userVerify = addFriend(user["username"],friend)
    
                if(userVerify){
    
                    const friendList = friend["friends"]
        
                    friendList.push(user)

        
                    const friendVerify = addFriend(friend["username"],user)
    
                    if(friendVerify){

                        res.status(200).send()

                    }else{
                        res.status(404).send({msg:'No se ha podido añadir al contacto correctamente.'})
                    }
                }else{
                    res.status(404).send({msg:'No se ha podido añadir al contacto correctamente.'})
                }
            }else{
    
                res.status(401).send({msg:'Token introducido no valido.'})
            }

        }catch(e){
            console.log(e);
            res.status(401).send({msg:'Error al verificar el token.'})
        }
    }
})


router.post('/deleteFriend',cors(corsOptionsDelegate),[
    body('token','No se ha podido eliminar al contacto de amigos').exists().isString().isLength({min:150})
],async(req,res)=>{
    const verify = validationResult(req)

    if(verify.isEmpty() == false){
        const error = verify.array()

        res.status(401).send(error)

    }else{
        const { token } = req.body            
        try{
            const verifyToken = jwt.verify(token,process.env.SECRET_TOKEN_CLIENT)
    
            if(verifyToken){
    
                const data = jwt.decode(token,process.env.SECRET_TOKEN_CLIENT)

                const user =  data["user"][0]["username"]
                const friend =  data["friend"][0]["username"]

                const deleteData =  await deleteFriend(user,friend)

                console.log(deleteData);

                if(deleteData){

                    const deleteFriendList = await deleteFriend(friend,user)

                    if(deleteFriendList){

                        res.status(200).send()

                    }else{
                        res.status(404).send({msg:'No se ha podido eliminar al contacto de amigos'})
                    }
                }else{
                    res.status(404).send({msg:'No se ha podido eliminar al contacto de amigos'})
                }
            }
        }catch(e){
            console.log(e);
            res.status(404).send({msg:'No se ha podido eliminar al contacto de amigos'})
        }
    }
})

module.exports = router