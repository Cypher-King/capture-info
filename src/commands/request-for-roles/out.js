var { connection } = require('../../handlers/connection');

module.exports = {
    name: "out",
    aliases: ["out"],
    category: "request-for-roles",
    description: ".",
    usage: "out",
    run: async (bot, message) => {
        connection.query(`SELECT * FROM \`discord_settings\` WHERE \`guild\` = '${message.guild.id}'`, async (error, guild) => {
            if (error) {
                message.reply({embeds:[{
                    color: 0xE53935,
                    title: `📛 | Системная ошибка`,
                    description: `\`\`\`Критическая ошибка! Воспроизведение функционала невозможно.\`\`\``
                }]});
                return console.log(error) && message.react(`⚠️`);
            }
            if (guild.length === 0) return; else if (guild[0].request_module == 0) return;
            var roleremove = message.member.roles.cache.filter(r => JSON.parse(guild[0].request_settings).roles_list.some(_r => _r == r.id));
            if (!roleremove.map(m => m.id)[0]) {
                message.member.send({embeds:[{
                    color: 0xE53935,
                    title: `📛 | Ошибка`,
                    description: `**У вас отсутствуют роли!**`
                }]});
                return message.delete().catch(() => {});
            }
            message.member.roles.remove(roleremove.map(m => m.id)[0])
            .then(async () => {
                if (JSON.parse(guild[0].request_settings).additional_roles[roleremove.map(m => m.id)[0]]) {
                    message.member.roles.remove(message.guild.roles.cache.get(JSON.parse(guild[0].request_settings).additional_roles[roleremove.map(m => m.id)[0]]))
                    .catch(() => {})
                }
                var logs = message.guild.channels.cache.find(c => c.id == JSON.parse(guild[0].request_settings).logs);
                if (logs) logs.send({
                    content: `>>> **Пользователь:** <@${message.member.id}>\n\`\`\`diff\n- Лишился роли "${roleremove.map(m => m.name)[0]}"\`\`\`**Причина: \`По собственному желанию\`**\n**————————————**`
                });
                await message.member.send({
                    embeds: [{
                        color: 0xf04747,
                        title: `Снятие фракционной роли`,
                        description: `**${message.member}, роль "${roleremove.map(m => m.name)[0]}" успешно была снята!**`,
                        footer: {
                            text: message.member.guild.name,
                            icon_url: message.member.guild.iconURL() 
                        }
                    }]
                })
                return message.delete().catch(() => {});
            })
            .catch(() => {
                message.reply({embeds:[{
                    color: 0xE53935,
                    title: `📛 | Ошибка`,
                    description: `**У меня недостаточно прав на то что-бы снять у вас роли...**`
                }]});
                return message.react(`❌`);
            })
        });
    }
};