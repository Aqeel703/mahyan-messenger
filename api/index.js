const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(morgan("dev"));
const axios = require("axios");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
app.use(express.json());
const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(process.env.TelegramBotId, {
  polling: true,
});

const sendMessageToGroup = async (groupChatId, message) => {
  try {
    await bot.sendMessage(groupChatId, message);
    console.log("Message sent successfully to group:", groupChatId);
    return "Message sent successfully to group";
  } catch (error) {
    console.error("Error sending message to group:", error);
    return "Failed to send message to group";
  }
};

app.post("/api/telegram/botmessage", async (req, res) => {
  try {
    const { message, groupChatId } = req.body;

    if (!groupChatId || !message) {
      return res
        .status(400)
        .json({ error: "groupChatId and message are required" });
    }

    const finalResp = await sendMessageToGroup(groupChatId, message);
    console.log(finalResp);

    if (finalResp === "Failed to send message to group") {
      return res.status(500).json({ error: "Failed to send message to group" });
    }

    res.status(200).json({ data: finalResp });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/", (req, res) => res.send("server is runing..."));

app.listen(8000, () => console.log("Server ready on port" + " " + 8000));

module.exports = app;
