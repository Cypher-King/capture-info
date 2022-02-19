var { Permissions } = require('discord.js'),
    { developers } = require('../../utils/index.ts'),
    { connection } = require('../../handlers/connection');

module.exports = {
    name: "capteval",
    aliases: ["capteval"],
    category: "dev",
    description: ".",
    usage: "capteval",
    run: async (bot, message) => {
        if (!developers.some(dev => dev == message.author.id)) return message.delete().catch(() => {});
        var args = message.content.slice(`/eval`).split(/ +/);
        var cmdrun = args.slice(1).join(" ");
        try {
            var time = Date.now();
            var result = await eval(cmdrun);
            var restime = Date.now();
            var type = typeof result;
            if (typeof result !== "string") result = require("util").inspect(result, { depth: 0 });
            message.reply({ content: `**Время:** \`${restime - time}ms\``})
        } catch (err) {
            message.reply({embed: {
                color: 0xE53935,
                description: `**Произошла ошибка:** \n\`\`\`js\n${err.name}\n\`\`\` \`\`\`xl\n${err.message}\`\`\``
            }})
            .then((msg) => { msg.delete({ timeout: 30000 }).catch(() => {}) });
        }
    }
}
