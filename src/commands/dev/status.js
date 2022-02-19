var Discord = require('discord.js'),
    { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: "capture-info",
    aliases: ["capture-info"],
    category: "dev",
    description: ".",
    usage: "capture-info",
    data: new SlashCommandBuilder()
        .setName('пинг')
        .setDescription('Статус работы бота'),
    run: async (bot, message) => {
        var totalSeconds = (bot.uptime / 1000);
        var days = Math.floor(totalSeconds / 86400);
        var hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = totalSeconds % 60;
        message.reply({embeds: [{
            color: 0xFFCA28,
            description: `\`\`\`Загрузка...\`\`\``,
        }]})
        .then((message) => {
            message.edit({embeds: [{
                color: 0xffffff,
                description: `**Тех. Информация**\`\`\`RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB\nОтвет Discord API: ${bot.ws.ping}ms\nВремя работы: ${hours} ч. ${minutes} мин. ${seconds} сек.\`\`\`\n**Информация о боте**\`\`\`Серверов: ${bot.guilds.cache.size}\nКаналов: ${bot.channels.cache.size}\nПользователей: ${bot.users.cache.size}\`\`\``,
            }]})
        });
        return message.react('✅')
    }
};