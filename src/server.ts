import  chatHandler  from "./handlers/chatHandler.js";

export default async ({ req, res, log }: {
  req: {
    body: string;
    method: string;
    path: string;
    headers: Record<string, string>;
  };
  res: {
    json: (data: unknown, statusCode?: number) => void;
    send: (body: string, statusCode?: number) => void;
  };
  log: (msg: string) => void;
  error: (msg: string) => void;
}) => {
  log('Function triggered successfully');
  try {
      const {action} = req.body ? JSON.parse(req.body) : {};

    switch (action) {
    case "chat":
      return  chatHandler(req,res);

    case "title":
      return res.json({
        title: "New Chat"
      });

    default:
      return res.json({
        error: "Unknown action"
      }, 400);
  }
  } catch (error) {
    console.log("Error from starter function",error);
  }


};
