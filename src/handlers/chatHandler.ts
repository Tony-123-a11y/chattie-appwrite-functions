import { ai } from "../lib/gemini.js"
import { Req,Res } from "../types/handlerTypes.js"

export default async function chatHandler (req:Req,res:Res){
    try {
        const {message}= await JSON.parse(req.body);
        const aiReply= await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: message
        });

        return res.json({
            reply:aiReply,
            success:true
        },200)
    } catch (error) {
        console.log(error)
            return res.json({
            reply:"Failed to generate response",
            success:false
        },401)
    }
   
}