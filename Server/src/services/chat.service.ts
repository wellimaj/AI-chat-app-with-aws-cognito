var WebSocket = require("ws");
import { Callback } from "mongoose";
import { Message } from "../Models/messages";
import { transformArrayOfDBObjects } from "../services/utils";
export class ChatAssistant {
  private userInput: string = "";
  private history: any = { internal: [], visible: [] };
  private messages = [];
  private ws: any;
  private request: any;
  private username: string;
  public newMessage: string;
  private callback: any;
  constructor(
    userInput: string,
    history: { internal: Array<string>; visible: Array<string> },
    username: string,
    callback: Callback
  ) {
    this.userInput = userInput;
    this.history = history;
    this.request = {
      user_input: userInput,
      prompt: userInput,
      max_new_tokens: 250,
      auto_max_new_tokens: false,
      history: history,
      mode: "instruct",
      character: "Example",
      instruction_template: "Vicuna-v1.1",
      your_name: "You",
      name1: username,
      // 'name2': 'name of character', // Optional
      // 'context': 'character context', // Optional
      // 'greeting': 'greeting', // Optional
      // 'name1_instruct': 'You', // Optional
      // 'name2_instruct': 'Assistant', // Optional
      // 'context_instruct': 'context_instruct', // Optional
      // 'turn_template': 'turn_template', // Optional
      regenerate: false,
      _continue: false,
      chat_instruct_command:
        'Continue the chat dialogue below. Write a single reply for the character "".\n\n',
      preset: "None",
      do_sample: true,
      temperature: 0.7,
      top_p: 0.1,
      typical_p: 1,
      epsilon_cutoff: 0,
      eta_cutoff: 0,
      tfs: 1,
      top_a: 0,
      repetition_penalty: 1.18,
      repetition_penalty_range: 0,
      top_k: 40,
      min_length: 0,
      no_repeat_ngram_size: 0,
      num_beams: 1,
      penalty_alpha: 0,
      length_penalty: 1,
      early_stopping: false,
      mirostat_mode: 0,
      mirostat_tau: 5,
      mirostat_eta: 0.1,
      guidance_scale: 1,
      negative_prompt: "",
      seed: -1,
      add_bos_token: true,
      truncation_length: 2048,
      ban_eos_token: false,
      skip_special_tokens: true,
      stopping_strings: [],
    };
    this.messages = [];
    this.username = username;
    this.history = history;
    this.userInput = userInput;
    
    if (!userInput) return;
    this.ws = new WebSocket(
      process.env.WS
    );
    this.callback = callback;
    this.ws.on("error", console.error);

    this.ws.on("open", () => {
      console.log("WebSocket opened");
      this.sendMessage(this.request);
    });

    this.ws.on("message", (data) => {
      this.handleMessage(data);
    });
  }
  getNewMessage() {
    return this.newMessage;
  }
  sendMessage(message) {
    this.ws.send(JSON.stringify(message));
  }
  async getMessages() {
    return transformArrayOfDBObjects(await Message.find({ userId: this.username }));
  }
  async handleMessage(data) {
    const message = JSON.parse(data);
    // console.log(message);
    if (message.event === "text_stream") {
      this.messages.push(message.text);
    } else if (message.event === "stream_end") {
      this.newMessage = this.messages.join("");
      const userMessage = new Message({
        userId: this.username,
        messageType: "user",
        content: this.userInput,
      });
      userMessage.save();

      // Create and save an AI-generated reply
      const aiReply = new Message({
        userId: this.username,
        messageType: "ai",
        content: this.newMessage,
      });
      aiReply.save();

      this.callback();
      this.ws.close(); // Close the WebSocket connection
    }
  }
}

