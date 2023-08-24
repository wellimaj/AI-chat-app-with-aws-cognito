const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  userId: String,
  messageType: String, // 'user' or 'ai'
  content: String,
  timestamp: { type: Date, default: Date.now },
});

export const Message = mongoose.model("Message", messageSchema);

