const express = require('express')

const router = express.Router()

const jwt = require('jsonwebtoken')

const cors =  require('cors')

const { corsOptionsDelegate} = require('../app')

router.use(cors({methods:['GET','POST']}))

router.get('/verify',(cors(corsOptionsDelegate)),(req,res)=>{
    const token = jwt.sign({verify:true},'secret')
    res.json({'token':token})
})

router.post('/verifyCode',(cors(corsOptionsDelegate)),(req,res)=>{
    const {phone} = req.body
    res.json({'number':phone})
})
module.exports = router