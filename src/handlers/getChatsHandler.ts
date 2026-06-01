import { Query } from "node-appwrite";
import type { Req, Res } from "../types/handlerTypes.ts";
import { tablesDB } from "../lib/appwrite.ts";

export default async function getChatsHandler(
  req: Req,
  res: Res,
  log: (message: string | undefined) => void
) {
  try {
    log("Fetching all chats");

    const result = await tablesDB.listRows(
      process.env.DATABASE_ID!,
      process.env.CHATS_COLLECTION_ID!,
      [
        Query.orderDesc("$createdAt"),
        Query.limit(50),
      ]
    );

    

    const chats = result.rows.map((row: Record<string, unknown>) => 
      {
        console.log("row:", row)
       return {
      id: row.$id,
      title: row.title,
      createdAt: row.$createdAt,
      updatedAt: row.$updatedAt,
        }

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
