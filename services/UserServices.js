const { userModel } = require('../models/user')

/**
 * The function `verifyUserEmail` asynchronously searches for a user with a specific email address in
 * the userModel.
 * @param data - The `data` parameter in the `verifyUserEmail` function likely contains an object with
 * user information, specifically an email address that is used to search for a user in the database.
 * @returns The function `verifyUserEmail` is returning the user object that matches the email provided
 * in the `data` parameter.
 */
const verifyUserEmail = async(data) =>{

    try{
        const user = await userModel.find({email:data.mail})
    
        return user

    }catch(e){
        return e
    }

}


/**
 * The function `verifyUsername` asynchronously searches for a user with a specific username in the
 * userModel collection.
 * @param data - The `data` parameter in the `verifyUsername` function likely contains an object with a
 * `username` property. This function is using `await` to asynchronously search for a user in the
 * database using the `userModel` and the provided `username` value from the `data` object. The
 * @returns The `verifyUsername` function is returning the user object that matches the provided
 * username in the `data` parameter.
 */
const verifyUsername = async(data) =>{

    const user = await userModel.find({username:data.username})

    return user
}

/**
 * The function `RegisterUser` creates a new user in a database using the provided data and returns
 * true if successful, false otherwise.
 * @param data - The `data` parameter in the `RegisterUser` function seems to contain information about
 * a user that is being registered. It likely includes the user's `username` and `email` that are used
 * to create a new user in the database.
 * @returns The RegisterUser function returns a boolean value. It returns `true` if the user
 * registration is successful and `false` if there is an error during the registration process.
 */
const RegisterUser = async(data) =>{

    try{
        const newUser = new userModel({username:data.username,email:data.email})

        await newUser.save()
    
        return true
    }catch(e){
        return false
    }
}

const updateCodeValidator = async(data) =>{

    try{

        await userModel.findOneAndUpdate({email:data.mail},{code:data.code})

        return true;

    }catch(e){

        return false;

    }

}



module.exports = {verifyUserEmail,verifyUsername,RegisterUser,updateCodeValidator}