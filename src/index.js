'use strict';

var { Intents, Client, Collection } = require('discord.js'),
    intents = new Intents().add('DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_TYPING', 'GUILDS', 'GUILD_BANS', 'GUILD_EMOJIS_AND_STICKERS', 'GUILD_INTEGRATIONS', 'GUILD_INVITES', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MESSAGE_TYPING', 'GUILD_PRESENCES', 'GUILD_VOICE_STATES', 'GUILD_WEBHOOKS'),
    bot = new Client({ 
        ws: { properties: { $browser: "Discord iOS" }},
        intents: [intents],
        partials: ['GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER', 'CHANNEL'],
    }),
    fs = require('fs');

bot.commands = new Collection(),
bot.aliases = new Collection(),
bot.categories = fs.readdirSync(`././src/commands`),
["command", "event", "slash"].forEach(handler => { require(`./utils/${handler}`)(bot); }),

bot.login(process.env.discord_token);