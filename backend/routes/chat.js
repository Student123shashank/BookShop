const express = require("express");
const axios = require("axios");

const router = express.Router();

const WIT_API_KEY = process.env.WIT_API_KEY;
const WIT_API_URL = "https://api.wit.ai/message";

async function callWitAPI(message) {
  const response = await axios.get(WIT_API_URL, {
    params: {
      q: message
    },
    headers: {
      Authorization: `Bearer ${WIT_API_KEY}`,
    },
  });
  return response.data;
}

router.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const data = await callWitAPI(userMessage);
    console.log("Response from Wit.ai:", data);

    let botReply = "I couldn't understand your message.";

    if (data.intents && data.intents.length > 0) {
      const intent = data.intents[0].name;

      switch (intent) {
        case 'greeting':
          botReply = "Hello! How can I assist you today?";
          break;
        case 'how_are_you':
          botReply = "I am fine, thank you! How are you?";
          break;
        default:
          botReply = "Sorry, I didn't get that. Can you please rephrase?";
      }
    }

    res.json({ reply: botReply });
  } catch (error) {
    console.error("Error communicating with Wit.ai:", error.message);
    res.status(500).json({ error: "Something went wrong with the AI response" });
  }
});

module.exports = router;
