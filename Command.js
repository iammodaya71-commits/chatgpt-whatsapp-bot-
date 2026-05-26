const { askAI } = require("./openai");

async function handleCommand(sock, msg, text, prefix, owner) {
  const from = msg.key.remoteJid;

  if (!text.startsWith(prefix)) return;

  const args = text.slice(prefix.length).trim().split(" ");
  const cmd = args.shift().toLowerCase();
  const query = args.join(" ");

  // 🤖 AI command
  if (cmd === "ai") {
    if (!query) {
      return sock.sendMessage(from, { text: "❌ Example: .ai hello" });
    }

    try {
      const reply = await askAI(query);
      return sock.sendMessage(from, { text: reply });
    } catch (e) {
      return sock.sendMessage(from, { text: "⚠️ AI error occurred" });
    }
  }

  // 📋 Menu
  if (cmd === "menu") {
    return sock.sendMessage(from, {
      text: `
🤖 BOT MENU

.ai <text> → ChatGPT reply
.ping → check bot
.menu → show menu

Owner: ${owner}
`
    });
  }

  // ⚡ Ping
  if (cmd === "ping") {
    return sock.sendMessage(from, { text: "⚡ Pong!" });
  }
}

module.exports = { handleCommand };
