import axios from 'axios';
import { getBotName } from '../../lib/botname.js';
import { getOwnerName } from '../../lib/menuHelper.js';

export default {
  name: 'maclookup',
  alias: ['mac', 'macvendor'],
  description: 'Look up MAC address vendor information',
  category: 'ethical hacking',
  usage: 'maclookup <mac-address>',
  async execute(sock, m, args, PREFIX) {
    const jid = m.key.remoteJid;
    if (!args[0]) {
      return sock.sendMessage(jid, { text: `╭─⌈ 🔎 *MAC ADDRESS LOOKUP* ⌋\n│\n├─⊷ *${PREFIX}maclookup <mac>*\n│  └⊷ Look up MAC address vendor\n│\n├─⊷ *Formats accepted:*\n│  └⊷ AA:BB:CC:DD:EE:FF\n│  └⊷ AA-BB-CC-DD-EE-FF\n│  └⊷ AABB.CCDD.EEFF\n│  └⊷ AABBCCDDEEFF\n│\n├─⊷ *Example:*\n│  └⊷ ${PREFIX}maclookup 00:1A:2B:3C:4D:5E\n│\n╰───────────────\n> *System By Ƭყɾҽx ƙʂԋ Ƭҽƈԋ*` }, { quoted: m });
    }
    await sock.sendMessage(jid, { react: { text: '⏳', key: m.key } });
    try {
      let mac = args[0].toUpperCase().replace(/[.\-]/g, ':');

      if (mac.indexOf(':') === -1 && mac.length === 12) {
        mac = mac.match(/.{1,2}/g).join(':');
      }

      const macRegex = /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/;
      if (!macRegex.test(mac)) {
        return sock.sendMessage(jid, { text: `❌ Invalid MAC address format.\n\nUse format: AA:BB:CC:DD:EE:FF` }, { quoted: m });
      }

      const { data } = await axios.get(`https://api.macvendors.com/${encodeURIComponent(mac)}`, {
        timeout: 10000,
        headers: { 'Accept': 'text/plain' }
      });

      const vendor = typeof data === 'string' ? data.trim() : 'Unknown';
      const oui = mac.split(':').slice(0, 3).join(':');

      const result = `╭─⌈ 🔎 *MAC ADDRESS LOOKUP* ⌋\n│\n├─⊷ *MAC Address:* ${mac}\n├─⊷ *OUI Prefix:* ${oui}\n├─⊷ *Vendor:* ${vendor}\n│\n├─⊷ *── Details ──*\n├─⊷ *Type:* ${mac.charAt(1) === '2' || mac.charAt(1) === '6' || mac.charAt(1) === 'A' || mac.charAt(1) === 'E' ? 'Locally Administered' : 'Universally Administered'}\n├─⊷ *Cast:* ${parseInt(mac.charAt(1), 16) % 2 === 0 ? 'Unicast' : 'Multicast'}\n│\n╰───────────────\n> *System By Ƭყɾҽx ƙʂԋ Ƭҽƈԋ*`;

      await sock.sendMessage(jid, { text: result }, { quoted: m });
      await sock.sendMessage(jid, { react: { text: '✅', key: m.key } });
    } catch (err) {
      await sock.sendMessage(jid, { react: { text: '❌', key: m.key } });
      const msg = err.response && err.response.status === 404
        ? '❌ MAC address vendor not found in database.'
        : `❌ Error: ${err.message}`;
      await sock.sendMessage(jid, { text: msg }, { quoted: m });
    }
  }
};
