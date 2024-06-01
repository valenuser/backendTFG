const { OpenAI } = require('openai') 

const openai = new  OpenAI({apiKey:process.env.KEY_OPENAI})

const messageGpt = async(message) =>{
    try{
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: message }],
            model: "gpt-3.5-turbo",
          });
    
          return completion

    }catch(e){
        console.log(e);
        return false
    }
}


module.exports = {messageGpt}