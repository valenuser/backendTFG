const mongoose = require('mongoose')

const dotenv = require('dotenv')

dotenv.config({path:'.env'})

/**
 * The code attempts to connect to a MongoDB database using Mongoose and logs a successful connection
 * or any errors that occur.
 */
const db = () =>{
    mongoose.connect(process.env.URI_MONGO)
}

try{
    db()

    mongoose.connection.on('open',()=>{
        console.log('conexion exitosa');
    })
}catch(e){
    mongoose.connection.on('error',()=>{
        console.log(e);
    })
}


module.exports = {db}   