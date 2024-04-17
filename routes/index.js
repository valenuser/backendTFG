const express = require('express')

const router = express.Router()

const jwt = require('jsonwebtoken')

const cors =  require('cors')

const { corsOptionsDelegate} = require('../app')

const { loginMail } = require('../services/MailServices')

router.use(cors({methods:['GET','POST']}))


router.get('/verify',(cors(corsOptionsDelegate)),(req,res)=>{
    const token = jwt.sign({verify:true},'secret')
    res.json({'token':token})
})


router.post('/verifyMail',(cors(corsOptionsDelegate)),(req,res)=>{
    const {mail} = req.body

    const code = Math.floor(Math.random()*1000000)

    const statusMail = loginMail(mail,code)

    if(statusMail){
        res.sendStatus(200)
    }else{
        res.sendStatus(301)
    }
})


module.exports = router