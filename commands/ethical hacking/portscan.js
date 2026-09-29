import net from 'net';
import { getBotName } from '../../lib/botname.js';
import dns from 'dns';
import { promisify } from 'util';
import { getOwnerName } from '../../lib/menuHelper.js';

const resolve4 = promisify(dns.resolve4);

const PORTS = [21, 22, 25, 53, 80, 110, 143, 443, 993, 995, 3306, 3389, 5432, 8080, 8443];

const SERVICE_NAMES = {
  21: 'FTP', 22: 'SSH', 25: 'SMTP', 53: 'DNS', 80: 'HTTP',
  110: 'POP3', 143: 'IMAP', 443: 'HTTPS', 993: 'IMAPS',
  995: 'POP3S', 3306: 'MySQL', 3389: 'RDP', 5432: 'PostgreSQL',
  8080: 'HTTP-Alt', 8443: 'HTTPS-Alt'
};

function scanPort(host, port, timeout = 3000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeout);
    socket.on('connect', () => { socket.destroy(); resolve({ port, open: true, service: SERVICE_NAMES[port] || 'Unknown' }); });
    socket.on('timeout', () => { socket.destroy(); resolve({ port, open: false, service: SERVICE_NAMES[port] || 'Unknown' }); });
    socket.on('error', () => { socket.destroy(); resolve({ port, open: false, service: SERVICE_NAMES[port] || 'Unknown' }); });
    try { socket.connect(port, host); } catch (e) { resolve({ port, open: false, service: SERVICE_NAMES[port] || 'Unknown' }); }
  });
}

export default {
  name: 'portscan',
  alias: ['scan', 'ports'],
  description: 'Scan common ports on a target host',
  category: 'ethical hacking',
  usage: 'portscan <ip or domain>',
  async execute(sock, m, args, PREFIX) {
    const jid = m.key.remoteJid;
    if (!args[0]) {
      return sock.sendMessage(jid, { text: `╭─⌈ 🚪 *PORT SCANNER* ⌋\n│\n├─⊷ *${PREFIX}portscan <ip or domain>*\n│  └⊷ Scan common ports on a target\n│\n├─⊷ *Example:*\n│  └⊷ ${PREFIX}portscan google.com\n│  └⊷ ${PREFIX}portscan 8.8.8.8\n│\n├─⊷ *Ports scanned:* ${PORTS.join(', ')}\n│\n╰───────────────\n> *System By Ƭყɾҽx ƙʂԋ Ƭҽƈԋ*` }, { quoted: m });
    }
    await sock.sendMessage(jid, { react: { text: '⏳', key: m.key } });
    try {
      let target = args[0].replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      let ip = target;

      const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipRegex.test(target)) {
        try {
          const ips = await resolve4(target);
          ip = ips[0];
        } catch (e) {
          throw new Error(`Cannot resolve domain: ${target}`);
        }
      }

      const results = await Promise.all(PORTS.map(port => scanPort(ip, port)));
      const openPorts = results.filter(r => r.open);
      const closedPorts = results.filter(r => !r.open);

      let result = `╭─⌈ 🚪 *PORT SCANNER* ⌋\n│\n`;
      result += `├─⊷ *Target:* ${target}\n`;
      result += `├─⊷ *IP:* ${ip}\n`;
      result += `├─⊷ *Scanned:* ${PORTS.length} ports\n`;
      result += `├─⊷ *Open:* ${openPorts.length} | *Closed:* ${closedPorts.length}\n│\n`;

      if (openPorts.length > 0) {
        result += `├─⊷ *🟢 Open Ports:*\n`;
        openPorts.forEach(p => {
          result += `│  └⊷ Port ${p.port} — ${p.service}\n`;
        });
      }

      result += `│\n├─⊷ *🔴 Closed Ports:*\n`;
      closedPorts.forEach(p => {
        result += `│  └⊷ Port ${p.port} — ${p.service}\n`;
      });

      result += `│\n╰───────────────\n> *System By Ƭყɾҽx ƙʂԋ Ƭҽƈԋ*`;

      await sock.sendMessage(jid, { text: result }, { quoted: m });
      await sock.sendMessage(jid, { react: { text: '✅', key: m.key } });
    } catch (err) {
      await sock.sendMessage(jid, { react: { text: '❌', key: m.key } });
      await sock.sendMessage(jid, { text: `❌ Error: ${err.message}` }, { quoted: m });
    }
  }
};
