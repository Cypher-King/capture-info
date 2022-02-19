'use strict';
var colors = require('colors/safe');

module.exports = async (bot) => {
	for (const [id, guild] of bot.guilds.cache) {
        await guild.members.fetch();
        await guild.channels.fetch()
    }
	console.log(colors.bgGreen(`[Клиент]: Авторизирован как ${bot.user.tag}`));
	console.log(colors.bgGreen(`[Клиент]: Серверов: ${bot.guilds.cache.size} ~ Каналов: ${bot.channels.cache.size} ~ Пользователей: ${bot.users.cache.size} ~ Пинг: ${bot.ws.ping} ~ RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}`))
    bot.user.setPresence({ activities: [{ name: `/notify | vk.com/capture_info`, type: 'PLAYING', status: 'dnd' }] });
};