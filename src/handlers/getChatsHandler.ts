import { Query } from "node-appwrite";
import type { Req, Res } from "../types/handlerTypes.ts";
import { tablesDB } from "../lib/appwrite.ts";
import { ChatRow } from "../types/rowType.ts";

export default async function getChatsHandler(
  req: Req,
  res: Res,
  log: (message: string | undefined) => void
) {
  try {
    const userId = req.headers["x-appwrite-user-id"];

  log(`User ID: ${userId}`);
    log("Fetching all chats");

  
    const result = await tablesDB.listRows(
      process.env.DATABASE_ID!,
      process.env.CHATS_COLLECTION_ID!,
      [
        Query.equal("userId", userId),
        Query.orderDesc("$createdAt"),
        Query.limit(50),
      ]
    );
   
    result.rows.map((row)=>{
      log(JSON.stringify(row))
    })
    


const chats = result.rows.map((row:ChatRow) => {
  return {
    id: row.$id,
    title: row.title,
    createdAt: row.$createdAt,
    updatedAt: row.$updatedAt,
  };
});

    return res.json({ chats, success: true }, 200);
  } catch (err) {
    console.log("Error fetching chats:", err);
    return res.json(
      { error: "Failed to fetch chats", success: false },
      500
    );
  }
}
