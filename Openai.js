const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function askAI(text) {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a helpful WhatsApp assistant bot."
      },
      {
        role: "user",
        content: text
      }
    ]
  });

  return res.choices[0].message.content;
}

module.exports = { askAI };
