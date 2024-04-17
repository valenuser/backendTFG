const nodemailer = require('nodemailer')

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


module.exports = {loginMail}