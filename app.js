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

/* The code block you provided is setting up a CORS (Cross-Origin Resource Sharing) configuration using
a whitelist approach in an Express application. Here's a breakdown of what it does: */

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


/* The code `app.use(session({ secret:'secret', saveUninitialized:true, resave: true }))` is setting up
a session middleware in the Express application. Here's what each option in the session
configuration does: */
app.use(session({
    secret:'secret',
    saveUninitialized:true,
    resave: true
}))


/* The code `app.use('/',require('./routes/index'))` is mounting the routes defined in the `index.js`
file to the root path of the application. This means that any requests made to the root path of the
server will be handled by the routes defined in the `index.js` file. */
app.use('/',require('./routes/index'))
app.use('/register',require('./routes/register'))
app.use('/login',require('./routes/login'))


const port = process.env.PORT || 3000

app.listen(port)
console.log('Server running on port 3000');


module.exports = {corsOptionsDelegate}