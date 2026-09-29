import axios from 'axios';
import yts from 'yt-search';
import { getBotName } from '../../lib/botname.js';
import { getOwnerName } from '../../lib/menuHelper.js';
import { keithAudio } from '../../lib/keithApi.js';

export default {
  name: 'dlmp3',
  aliases: ['wolfmp3', 'wdl'],
  description: 'Download MP3 audio',
  category: 'Downloader',

  async execute(sock, m, args, prefix) {
    const jid = m.key.remoteJid;
    const p = prefix || '.';
    const quotedText = m.quoted?.text?.trim()
      || m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation?.trim()
      || '';

    let searchQuery = args.length > 0 ? args.join(' ') : quotedText;

    if (!searchQuery) {
      return sock.sendMessage(jid, {
        text: `╭─⌈ 🎵 *DLMP3 DOWNLOADER* ⌋\n│\n├─⊷ *${p}dlmp3 <song name or URL>*\n│  └⊷ Download audio\n├─⊷ *Reply to a text message*\n│  └⊷ Uses replied text as search\n│\n╰⊷ _System By Ƭყɾҽx ƙʂԋ Ƭҽƈԋ`
      }, { quoted: m });
    }

    console.log(`🎵 [DLMP3] Request: ${searchQuery}`);
    await sock.sendMessage(jid, { react: { text: '⏳', key: m.key } });

    try {
      const isUrl = /^https?:\/\//i.test(searchQuery);
      let ytUrl = searchQuery;
      let trackTitle = searchQuery;
      let thumbnail = '';

      if (!isUrl) {
        const { videos } = await yts(searchQuery);
        if (videos?.length) {
          const top = videos[0];
          ytUrl      = top.url;
          trackTitle = top.title || searchQuery;
          thumbnail  = top.thumbnail || `https://img.youtube.com/vi/${top.videoId}/hqdefault.jpg`;
        }
      } else {
        const vid = searchQuery.match(/(?:v=|youtu\.be\/)([^&?\/\s]{11})/i)?.[1] || '';
        if (vid) thumbnail = `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
      }

      await sock.sendMessage(jid, { react: { text: '📥', key: m.key } });

      const audioBuffer = await keithAudio(ytUrl);

      if (!audioBuffer) {
        await sock.sendMessage(jid, { react: { text: '❌', key: m.key } });
        return sock.sendMessage(jid, { text: `❌ Download failed. Please try again later.` }, { quoted: m });
      }

      const sizeMB = (audioBuffer.length / 1024 / 1024).toFixed(1);
      if (parseFloat(sizeMB) > 50) {
        await sock.sendMessage(jid, { react: { text: '❌', key: m.key } });
        return sock.sendMessage(jid, { text: `❌ File too large: ${sizeMB}MB (max 50MB)` }, { quoted: m });
      }

      let thumbnailBuffer = null;
      if (thumbnail) {
        try {
          const tr = await axios.get(thumbnail, { responseType: 'arraybuffer', timeout: 10000 });
          if (tr.data.length > 1000) thumbnailBuffer = Buffer.from(tr.data);
        } catch {}
      }

      const cleanTitle = trackTitle.replace(/[^\w\s.-]/gi, '').substring(0, 50);

      await sock.sendMessage(jid, {
        audio:    audioBuffer,
        mimetype: 'audio/mpeg',
        ptt:      false,
        fileName: `${cleanTitle}.mp3`,
        contextInfo: {
          externalAdReply: {
            title:                 trackTitle.substring(0, 60),
            body:                  `🎵 ${sizeMB}MB | Downloaded by ${getBotName()}`,
            mediaType:             2,
            thumbnail:             thumbnailBuffer,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });

      await sock.sendMessage(jid, { react: { text: '✅', key: m.key } });
      console.log(`✅ [DLMP3] Success: ${trackTitle} (${sizeMB}MB)`);

    } catch (error) {
      console.error('❌ [DLMP3] Error:', error.message);
      await sock.sendMessage(jid, { react: { text: '❌', key: m.key } });
      await sock.sendMessage(jid, { text: `❌ DLMP3 Error: ${error.message}` }, { quoted: m });
    }
  }
};
