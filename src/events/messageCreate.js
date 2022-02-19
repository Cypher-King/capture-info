'use strict';

var { check_new_capture, check_new_strela, anketa_winslow } = require('../handlers/index.js'),
    { send_request } = require('../handlers/request-for-roles.js');

module.exports = async (bot, message) => {
	if (message.author.bot || message.channel.type === "DM") return;
    anketa_winslow(bot, message);
    await check_new_strela(bot, message);
    await check_new_capture(bot, message);
    await send_request(bot, message);
    if (message.content.startsWith("/")) {
        var args = message.content.slice(1).trim().split(/ +/g);
        var cmd = args.shift().toLowerCase();
        var command = bot.commands.get(cmd);
        if (cmd.length === 0) return;
        if (!command) command = bot.commands.get(bot.aliases.get(cmd));
        if (command) command.run(bot, message);
    }
};
