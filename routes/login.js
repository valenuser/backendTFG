const express = require('express')

const router = express.Router()

const cors =  require('cors')

const { corsOptionsDelegate } = require('../app')

/* The code `router.use(cors({methods:['GET','POST']}))` is setting up CORS (Cross-Origin Resource
Sharing) middleware for the Express router. It allows only GET and POST requests from specified
origins to access the routes defined in the router. This helps in controlling access to resources on
the server from different domains or origins. */
router.use(cors({methods:['GET','POST']}))


router.post('/',cors(corsOptionsDelegate),(req,res)=>{
    const { mail, code } = req.body
})





module.exports = router