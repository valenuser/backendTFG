const nodemailer = require('nodemailer')

/**
 * The function `loginMail` sends an email with a code for login authentication.
 * @param data - The `data` parameter in the `loginMail` function represents the email address of the
 * recipient to whom the login code will be sent.
 * @param code - The `code` parameter in the `loginMail` function is the unique code that will be sent
 * to the user's email address for authentication or login purposes. This code is included in the email
 * message along with a greeting to the user.
 * @returns The `loginMail` function is returning a boolean value. If the email sending process is
 * successful, it will return `true`. If there is an error during the process, it will return `false`.
 */
const loginMail = (data,code) =>{

    try{
        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.userMail,
                pass:process.env.passwordMail
            }
        })
    
        const mailOptions = {
            from:process.env.userMail,
            to:data,
            subject:`Hola ${data} !`,
            text:`Aqui tienes tu código para iniciar sesion: ${code}`
        }
    
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });

        return true
    }catch(e){
        return false
    }


}


/**
 * The function `registerMail` sends a welcome email to a user after registration, using nodemailer to
 * connect to a Gmail account and send the email.
 * @param data - The `data` parameter in the `registerMail` function is typically the email address
 * where the registration confirmation email will be sent. This email address is usually provided by
 * the user during the registration process.
 * @param username - The `username` parameter in the `registerMail` function is the username of the
 * user who is registering for the service. It is used to personalize the email message that is sent to
 * the user after registration.
 * @returns The `registerMail` function is returning `true` if the email was sent successfully, and
 * `false` if there was an error during the process.
 */
const registerMail = (data,username) =>{

    try{
        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.userMail,
                pass:process.env.passwordMail
            }
        })
    
        const mailOptions = {
            from:process.env.userMail,
            to:data,
            subject:`Bienvenido ${username} !`,
            text:`Recuerda que cada vez que quieras iniciar sesion, se enviara un mail de verificacion. Gracias por registrarte!`
        }
    
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });

        return true
    }catch(e){
        return false
    }


}


module.exports = {loginMail, registerMail}