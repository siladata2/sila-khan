# 𝚃𝚈𝚁𝙴𝚇-𝙺𝚂𝙷-𝙼𝙳

A feature-rich WhatsApp bot built with Node.js and Baileys. This release updates the bot identity, owner display, menus, deployment metadata and first-party links while retaining the existing commands and integrations.

## Official identity

- **Bot:** 𝚃𝚈𝚁𝙴𝚇-𝙺𝚂𝙷-𝙼𝙳
- **Developer:** Ƭყɾҽx-ƙʂԋ-Ƭҽƈԋ
- **Owner contact:** +255610744352
- **Official footer:** `System By Ƭყɾҽx ƙʂԋ Ƭҽƈԋ`
- **Repository:** https://github.com/siladata2/Tyrex-bot
- **Bot image:** https://raw.githubusercontent.com/siladata2/Tyrex-bot/refs/heads/main/tyrex/tyrex.jpeg
- **Repository image path:** `tyrex/tyrex.jpeg`
- **WhatsApp group:** https://chat.whatsapp.com/KR3jWgAG32lFL03ZdbSc66
- **WhatsApp channel:** https://whatsapp.com/channel/0029VbDAQiXHbFV0iSwCtz2o
- **Main channel JID:** `120363429539292697@newsletter`

## Features

The project retains its current command system, including owner and group controls, media and sticker tools, downloads, AI/image commands, games, utilities, channel tools, status/session management, and deployment/health helpers. Existing command names, aliases and runtime configuration remain in place.

## Run locally

1. Use Node.js 20 or a compatible newer runtime and install the dependencies declared in `package.json`.
2. Configure the deployment environment with a valid `SESSION_ID`, `BOT_PREFIX`, and any optional service credentials needed by commands you use.
3. Start the bot with `npm start`.

The session decoder accepts the new `TYREX:` label and the earlier `WOLF-BOT:` label for compatibility. Do not replace or delete an existing WhatsApp session unless you intend to relink the account.

## Deployment and compatibility

`deploy.html` contains the existing deployment choices and setup UI. Keep provider buildpacks, external API endpoints, environment secrets, session state and third-party integrations configured as required by your host. The bot's own repository is now `siladata2/Tyrex-bot`.

- Existing commands, API integrations, dependency names and persistent state are retained.
- The `silent-wolf-bot` local dependency entry is intentionally unchanged because it is a required dependency declaration in the supplied project.
- Custom menu images, owner settings and bot-name overrides may still take precedence when present in runtime data.
