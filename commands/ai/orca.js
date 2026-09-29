import { callAI } from '../../lib/aiHelper.js';
import { getOwnerName } from '../../lib/menuHelper.js';

export default {
  name: 'orca',
  description: 'Microsoft Orca AI',
  category: 'ai',
  aliases: ["orcaai","orca2"],
  usage: 'orca [question]',

  async execute(sock, m, args, PREFIX) {
    const jid = m.key.remoteJid;
    let query = args.length > 0 ? args.join(' ') : (m.quoted?.text || '');

    if (!query) {
      return sock.sendMessage(jid, {
        text: `╭─⌈ 🐋 *ORCA AI* ⌋\n├─⊷ *${PREFIX}orca <question>*\n│  └⊷ Microsoft Orca AI\n╰⊷ *System By Ƭყɾҽx ƙʂԋ Ƭҽƈԋ*`
      }, { quoted: m });
    }

    try {
      await sock.sendMessage(jid, { react: { text: '⏳', key: m.key } });

      let reply = await callAI('orca', query);
      if (reply.length > 4000) reply = reply.substring(0, 4000) + '\n\n_...(truncated)_';

      await sock.sendMessage(jid, { react: { text: '✅', key: m.key } });
      await sock.sendMessage(jid, {
        text: `🐋 *ORCA AI*\n━━━━━━━━━━━━━━━━━\n${reply}\n━━━━━━━━━━━━━━━━━\n_System By Ƭყɾҽx ƙʂԋ Ƭҽƈԋ`
      }, { quoted: m });

    } catch (err) {
      console.error('[ORCA] Error:', err.message);
      await sock.sendMessage(jid, { react: { text: '❌', key: m.key } });
      await sock.sendMessage(jid, { text: `❌ *orca AI Error*\n\n${err.message}\n\nPlease try again later.` }, { quoted: m });
    }
  }
};
