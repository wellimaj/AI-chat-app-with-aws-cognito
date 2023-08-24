import express, { Request, Response } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { db } from "../server";
import { Message } from "../Models/messages";
import { ChatAssistant } from "../services/chat.service";
export class ProtectedController {
  public path = "/protected";
  public router = express.Router();
  private AuthMiddleWare: any;
  private wsProxy: any;
  constructor() {
    this.AuthMiddleWare = new AuthMiddleware();

    this.initRoutes();
  }
  private initRoutes() {
    this.router.use(this.AuthMiddleWare.verfiyToken);
    this.router.post("/chat", this.chat);
    this.router.post("/allMessages", this.allMessages);
  }
  async chat(req: any, res: Response) {
    const { userInput, history } = req.body;
    const num = await Message.countDocuments({
      userId: req.jwtData.username,
      messageType: "ai",
    });
    if (num > 25) {
      res.status(429).send({
        message: "You have reached your message limit for free Tier",
        origin: "ai",
      });
      return
    }
    const chat = new ChatAssistant(
      userInput,
      history,
      req.jwtData.username,
      (data) => {
        res.send({ message: chat.getNewMessage(), origin: "ai" }).end();
      }
    );
  }
  async allMessages(req: any, res: Response) {
    const chat = new ChatAssistant(
      "",
      { internal: [], visible: [] },
      req.jwtData.username,
      () => {}
    );
    res.send({ allMessages: await chat.getMessages() || [] }).end();
  }
}
