const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const axios = require("axios");
const router = express.Router();

const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(process.env.TelegramBotId, {
  polling: true,
});
const sendMessageToGroup = async (groupChatId, message) => {
  try {
    await bot.sendMessage(groupChatId, message);
    console.log("Message sent successfully to group");
    return "Message sent successfully to group";
  } catch (error) {
    console.error("Error sending message to group:", error);
    return "error";
  }
};
app.post("/api/telegram/botmessage", async (req, res) => {
  try {
    const { message, groupChatId } = req.body;

    const finalResp = await sendMessageToGroup(groupChatId, message);
    console.log(finalResp);
    res.status(200).json({ data: finalResp });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => res.send("server is runing..."));

app.listen(4000, () => console.log("Server ready on port 4000."));

module.exports = app;
