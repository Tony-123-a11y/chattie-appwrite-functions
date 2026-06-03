import { Query } from "node-appwrite";
import type { Req, Res } from "../types/handlerTypes.ts";
import { tablesDB } from "../lib/appwrite.ts";

export default async function getMessagesHandler(
  req: Req,
  res: Res,
  log: (message: string | undefined) => void
) {
  try {
    const { chatId } = JSON.parse(req.body);
    
    const chat = await tablesDB.getRow({
      databaseId: process.env.DATABASE_ID!,
      tableId: process.env.CHATS_COLLECTION_ID!,
      rowId: chatId,
    });
    const userId = req.headers["x-appwrite-user-id"];
    // Authorize the user trying to access messages
    if (userId === chat.userId) {
      return res.json({
        reply: "Unauthorized",
        success: false
      }, 500)
    }
    if (!chatId) {
      return res.json({ error: "chatId is required", success: false }, 400);
    }

    log(`Fetching messages for chat: ${chatId}`);


    const result = await tablesDB.listRows(
      process.env.DATABASE_ID!,
      process.env.MESSAGES_COLLECTION_ID!,
      [
        Query.equal("chatId", chatId),
        Query.orderAsc("$createdAt"),
        Query.limit(100),
      ]
    );

    const messages = result.rows.map((row: Record<string, unknown>) => ({
      id: row.$id,
      text: row.text,
      role: row.role,
      createdAt: row.$createdAt,
      updatedAt: row.$updatedAt,
    }));

    return res.json({ messages, success: true }, 200);
  } catch (err) {
    console.log("Error fetching messages:", err);
    return res.json(
      { error: "Failed to fetch messages", success: false },
      500
    );
  }
}
