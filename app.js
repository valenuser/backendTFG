const express = require('express')

const app = express()

const session = require('express-session')

const morgan = require('morgan')

const { db } = require('./db')

const dotenv = require('dotenv')

app.use(morgan('dev'))

app.use(express.urlencoded({extended:false}))
app.use(express.json())
dotenv.config({path:'.env'})

const whiteList = ['http://localhost:8080']

const corsOptionsDelegate = (req,callback)=>{
    let corsOptions;
    if(whiteList.indexOf(req.header('Origin')) !== -1){
        corsOptions = {origin: true}
    }else{
        corsOptions = {origin: false}   
    }
    callback(null,corsOptions)
}


app.use(session({
    secret:'secret',
    saveUninitialized:true,
    resave: true
}))


app.use('/',require('./routes/index'))


const port = process.env.PORT || 3000

app.listen(port)
console.log('Server running on port 3000');


module.exports = {corsOptionsDelegate}