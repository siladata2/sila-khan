// commands/owner/silent.js
export default {
  name: "silent",
  description: "Show TYREX silent-mode status",
  execute: async (sock, msg, args) => {
    const from = msg.key.remoteJid;
    const sender = msg.pushName || "Owner";

    const loadingFrames = [
      "🟢░░░░░░░░░░ Ego Awakening...",
      "🟢🟢░░░░░░░░ Ego Rising...",
      "🟢🟢🟢░░░░░░ Silent Power...",
      "🟢🟢🟢🟢░░░░ Dominance Loading...",
      "🟢🟢🟢🟢🟢░░ Alpha Power Incoming...",
      "🟢🟢🟢🟢🟢🟢░ The 𝚃𝚈𝚁𝙴𝚇-𝙺𝚂𝙷-𝙼𝙳 Stirs...",
      "🟢🟢🟢🟢🟢🟢🟢 Full Ego Unleashed!"
    ];

    // Send each loading frame as a new message
    for (const frame of loadingFrames) {
      await sock.sendMessage(from, { text: frame });
      await new Promise(r => setTimeout(r, 1000));
    }

    const egoMessage = `
🌌🌑 *𝚃𝚈𝚁𝙴𝚇-𝙺𝚂𝙷-𝙼𝙳 RISES* 🌑🌌
────────────────────────────
🔥 Name: *${sender}*
⚡ Title: *The Silent Alpha*
⚡ Status: *Focused, quiet, and ready*
🌍 Presence: *Connected across the network*
💀 Enemies: *Crushed in shadows*

🟢 No roar... only silence.
🟢 No mercy... only dominance.
🟢 No defeat... only victory.

⚡ *TYREX works quietly and responds when needed.*
────────────────────────────
    `;

    await sock.sendMessage(from, { text: egoMessage });
  }
};


