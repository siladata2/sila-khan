import { getBotName } from '../../lib/botname.js';

const BOT_IMAGE_URL = 'https://raw.githubusercontent.com/siladata2/Tyrex-bot/refs/heads/main/tyrex/tyrex.jpeg';
const OWNER_NAME = 'Ƭყɾҽx-ƙʂԋ-Ƭҽƈԋ';
const OWNER_NUMBER = '255610744352';
const REPOSITORY_URL = 'https://github.com/siladata2/Tyrex-bot';
const GROUP_URL = 'https://chat.whatsapp.com/KR3jWgAG32lFL03ZdbSc66';
const CHANNEL_URL = 'https://whatsapp.com/channel/0029VbDAQiXHbFV0iSwCtz2o';
const FOOTER = 'System By Ƭყɾҽx ƙʂԋ Ƭҽƈԋ';

export default {
  name: 'about',
  description: 'Displays TYREX bot and official project information',
  async execute(sock, m) {
    const jid = m.key.remoteJid;
    const caption = [
      `*${getBotName()}*`,
      '',
      'A WhatsApp bot built with Node.js and Baileys.',
      `*Developer:* ${OWNER_NAME}`,
      `*Owner:* +${OWNER_NUMBER}`,
      `*Repository:* ${REPOSITORY_URL}`,
      `*WhatsApp group:* ${GROUP_URL}`,
      `*WhatsApp channel:* ${CHANNEL_URL}`,
      '',
      FOOTER,
    ].join('\n');

    try {
      await sock.sendMessage(jid, {
        image: { url: BOT_IMAGE_URL },
        caption,
        mimetype: 'image/jpeg',
      }, { quoted: m });
    } catch (error) {
      console.error('About command image send failed:', error);
      await sock.sendMessage(jid, { text: caption }, { quoted: m });
    }
  },
};
