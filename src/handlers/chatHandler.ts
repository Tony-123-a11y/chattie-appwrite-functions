import { ai } from "../lib/gemini.ts"
import type { Req, Res } from "../types/handlerTypes.ts"
import { ID } from "node-appwrite";
import {tablesDB} from "../lib/appwrite.ts"


export default async function chatHandler(req: Req, res: Res,  log: (message: string | undefined) => void) {
    try {
        const { message, chatId } =  JSON.parse(req.body);
        let chat;
        let currentChatId = chatId;
log(`GOOGLE_GEMINI_API_KEY: ${process.env.GOOGLE_GEMINI_API_KEY}`);
log(`DATABASE_ID: ${process.env.DATABASE_ID}`);
log(`CHATS_COLLECTION_ID: ${process.env.CHATS_COLLECTION_ID}`);
log(`MESSAGES_COLLECTION_ID: ${process.env.MESSAGES_COLLECTION_ID}`);
log(`Function API Key exists: ${!!process.env.APPWRITE_FUNCTION_API_KEY}`);
log(`Endpoint: ${process.env.APPWRITE_FUNCTION_API_ENDPOINT}`);
log(`Project: ${process.env.APPWRITE_FUNCTION_PROJECT_ID}`);
                
        log(process.env.CHATS_COLLECTION_ID)
        if (!currentChatId) {
            chat = await tablesDB.createRow(
               process.env.DATABASE_ID!,
                process.env.CHATS_COLLECTION_ID!,
                ID.unique(),
                {
                    title: message.slice(0, 50),
                }
            );
           currentChatId = chat?.$id;   
        }
        const newMessage = await tablesDB.createRow(
            process.env.DATABASE_ID!,
            process.env.MESSAGES_COLLECTION_ID!,
            ID.unique(),
            {
                chatId: currentChatId,
                text: message,
                role: "user",

            }
        )

        const aiReply = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: message
        });

        const replyMessage = await tablesDB.createRow(
            process.env.DATABASE_ID!,
            process.env.MESSAGES_COLLECTION_ID!,
            ID.unique(),
            {
                chatId: currentChatId,
                text: aiReply.text,
                role: "user",

            }
        )

        return res.json({
            reply: aiReply.text,
            chatId: currentChatId,
            success: true
        }, 200)
    } catch (error) {
        console.log(error)
        return res.json({
            reply: "Failed to generate response",
            success: false
        }, 500)
    }

}