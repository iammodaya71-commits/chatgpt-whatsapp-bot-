const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const readline = require("readline");

function ask(q) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(res => rl.question(q, ans => {
    rl.close();
    res(ans);
  }));
}

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState("./session");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: "silent" })
  });

  sock.ev.on("creds.update", saveCreds);

  // 🔑 Pair Code Login
  if (!sock.authState.creds.registered) {
    const number = await ask("📱 Enter number (with country code): ");
    const code = await sock.requestPairingCode(number.trim());
    console.log("🔑 PAIRING CODE: ", code);
  }

  sock.ev.on("connection.update", (u) => {
    if (u.connection === "open") {
      console.log("🤖 Bot Connected!");
    }
  });
}

start();
