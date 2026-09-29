import moment from "moment-timezone";

export default {
  name: "time",
  description: "Get current time of any city worldwide 🌍",
  async execute(sock, m, args) {
    try {
      let tz = args.length > 0 ? args.join("_") : "UTC";
      tz = tz.charAt(0).toUpperCase() + tz.slice(1);

      const zones = moment.tz.names();
      let match = zones.find(z => z.toLowerCase().includes(tz.toLowerCase()));

      if (!match) {
        await sock.sendMessage(
          m.key.remoteJid,
          { text: `⚡❌ Couldn’t find *${tz}* in the time-zone database.\nTry: .time Nairobi | .time Tokyo | .time New_York` },
          { quoted: m }
        );
        return;
      }

      const now = moment().tz(match);
      const formatted = now.format("dddd, MMMM Do YYYY\n⏰ HH:mm:ss A");

      let reply = `
🌙⚡ *𝚃𝚈𝚁𝙴𝚇-𝙺𝚂𝙷-𝙼𝙳 TIME* ⚡🌙
━━━━━━━━━━━━━━━━━━
📍 Location: *${match}*
📅 Date: ${formatted.split("\n")[0]}
${formatted.split("\n")[1]}
━━━━━━━━━━━━━━━━━━
⚡ Local time, wherever you are.
`;

      await sock.sendMessage(
        m.key.remoteJid,
        { text: reply },
        { quoted: m }
      );
    } catch (err) {
      console.error("Error in time command:", err);
      await sock.sendMessage(
        m.key.remoteJid,
        { text: "⚡⚠️ Could not retrieve the time. Try again later." },
        { quoted: m }
      );
    }
  },
};
