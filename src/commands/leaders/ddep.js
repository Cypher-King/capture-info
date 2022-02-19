var { MessageActionRow, MessageSelectMenu } = require('discord.js'),   
    { connection } = require('../../handlers/connection');

module.exports = {
    name: "ddep",
    aliases: ["ddep"],
    category: "leaders",
    description: ".",
    usage: "adep",
    run: async (bot, message) => {
        connection.query(`SELECT * FROM \`discord_settings\` WHERE \`guild\` = '${message.guild.id}'`, async (error, guild) => {
            if (error) {
                message.reply({
                    embeds:[{
                        color: 0xE53935,
                        title: `⚠️ | Системная ошибка`,
                        description: `\`\`\`Критическая ошибка! Воспроизведение функционала невозможно.\`\`\``
                    }]
                });
                return console.log(error) && message.react(`⚠️`);
            }
            if (guild.length === 0) return; else if (guild[0].deputy_module == 0) return;
            if (!message.member.roles.cache.some(r => (JSON.parse(guild[0].deputy_settings).leader_roles).includes(r.id))) {
                message.channel.send({ 
                    embeds: [{
                        color: 0xE53935,
                        title: `📛 | Ошибка`,
                        description: `\`\`\`Недостаточно прав!\`\`\``,
                    }]
                }).then((msg) => { setTimeout(() => msg.delete().catch(() => {}), 30000); });
                return message.delete().catch(() => {});
            }
            if (!message.mentions.users) {
                message.channel.send({
                    embeds:[{
                        color: 0xE53935,
                        title: `📛 | Ошибка`,
                        description: `\`\`\`Упомяните пользователя/пользователей!\`\`\``,
                        footer : {
                            text: '/ddep [Пользователь/Несколько пользователей]'
                        }   
                    }]
                }).then((msg) => { setTimeout(() => msg.delete().catch(() => {}), 30000); });
                return message.delete().catch(() => {})
            }
            var users = [];
            message.mentions.members.forEach((member) => { users.push(member) });
            if (users.length == 0) {
                message.channel.send({
                    embeds:[{
                        color: 0xE53935,
                        title: `📛 | Ошибка`,
                        description: `\`\`\`Упомяните пользователя/пользователей!\`\`\``,
                        footer : {
                            text: '/ddep [Пользователь/Несколько пользователей]'
                        }   
                    }]
                });
            }
            if (users.length == 1 && users.map(m => m.id).includes(message.author.id)) {
                message.channel.send({
                    embeds:[{
                        color: 0xE53935,
                        title: `📛 | Ошибка`,
                        description: `\`\`\`Самому себе запросить нельзя!\`\`\``,
                        footer : {
                            text: '/adep [Пользователь/Несколько пользователей]'
                        }   
                    }]
                }).then((msg) => { setTimeout(() => msg.delete().catch(() => {}), 30000); });
                return message.delete().catch(() => {})
            } else if (users.length < 2 && users.map(m => m.id).includes(message.author.id)) {
                users = users.filter(function(user) { if (!user.map(m => m.id).includes(message.author.id)) return user });
            }
            var row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select')
                    .setPlaceholder('Выберите дейтсвие')
                    .addOptions([
                        {
                            label: '✅',
                            description: 'Снять роль игроку',
                            value: 'role9r_plus',
                        },
                        {
                            label: '⏳',
                            description: 'Режим ожидания',
                            value: 'role9_wait',
                        },
                        {
                            label: '❌',
                            description: 'Отклонить запрос игрока',
                            value: 'role9_minus',
                        },
                        {
                            label: '🗑️',
                            description: 'Очистить запрос',
                            value: 'role9_delete',
                        },
                    ]),
            );
            if (message.member.roles.cache.some(r => (JSON.parse(guild[0].deputy_settings).ghetto_leader).includes(r.id))) {
                var role = null, name = null, senators = message.guild.roles.cache.filter(r => (JSON.parse(guild[0].deputy_settings).senators_ghetto).some(_r => _r == r.id));
                if (message.member.roles.cache.some(r => ((r.name).toLowerCase()).includes('grove'))) role = JSON.parse(guild[0].deputy_settings).fractions['grove'], name = 'Grove Street'; // Grove
                else if (message.member.roles.cache.some(r => ((r.name).toLowerCase()).includes('ballas'))) role = JSON.parse(guild[0].deputy_settings).fractions['ballas'], name = 'Ballas Gang'; // Ballas
                else if (message.member.roles.cache.some(r => ((r.name).toLowerCase()).includes('rifa'))) role = JSON.parse(guild[0].deputy_settings).fractions['rifa'], name = 'San Fierro Rifa'; // Rifa
                else if (message.member.roles.cache.some(r => ((r.name).toLowerCase()).includes('aztec'))) role = JSON.parse(guild[0].deputy_settings).fractions['aztec'], name = 'Varrios Los Aztecas'; // Aztec
                else if (message.member.roles.cache.some(r => ((r.name).toLowerCase()).includes('vagos'))) role = JSON.parse(guild[0].deputy_settings).fractions['vagos'], name = 'Los Santos Vagos'; // Vagos
                else if (message.member.roles.cache.some(r => ((r.name).toLowerCase()).includes('night'))) role = JSON.parse(guild[0].deputy_settings).fractions['nw'], name = 'Night Wolves'; // Night Wolves
                else {
                    message.channel.send({
                        embeds:[{
                            color: 0xE53935,
                            title: `📛 | Ошибка`,
                            description: `\`\`\`Не смог понять на какую фракцию запрашивается роль...\`\`\``,
                        }]
                    }).then((msg) => { setTimeout(() => msg.delete().catch(() => {}), 30000); });
                    return message.delete().catch(() => {})
                }
                var channel = message.guild.channels.cache.find(c => c.id == JSON.parse(guild[0].deputy_settings).ghetto_channel);
                if (!channel) {
                    message.channel.send({
                        embeds:[{
                            color: 0xE53935,
                            title: `⚠️ | Ошибка`,
                            description: `\`\`\`Не могу найти канал по выдаче ролей 9 гетто...\`\`\``,
                        }]
                    }).then((msg) => { setTimeout(() => msg.delete().catch(() => {}), 30000); });
                    return message.delete().catch(() => {})
                }
                var currole = message.guild.roles.cache.find(r => r.id == role);
                if (!currole) {
                    message.channel.send({
                        embeds:[{
                            color: 0xE53935,
                            title: `⚠️ | Ошибка`,
                            description: `\`\`\`Роль "${name}" не была найдена на сервере..\`\`\``,
                        }]
                    }).then((msg) => { setTimeout(() => msg.delete().catch(() => {}), 30000); });
                    return message.delete().catch(() => {})
                }
                users.forEach((members) => {
                    var curuser = message.guild.members.cache.get(members.id);
                    if (curuser) {
                        if (!curuser.roles.cache.some(r => (r.id).includes(currole.id))) {
                            message.channel.send({
                                embeds:[{
                                    color: 0xE53935,
                                    title: `📛 | Ошибка`,
                                    description: `**У пользователя ${curuser} нет роли заместителя фракции "${name}"**`,
                                }]
                            }).then((msg) => { setTimeout(() => msg.delete().catch(() => {}), 30000); });
                            return message.delete().catch(() => {})
                        }
                        channel.send({
                            content: `${senators.map(m => `<@&${m.id}>`).join(', ')}`,
                            embeds: [{
                                title: "Снятие роли заместителя",
                                color: 0x93ff54,
                                fields: [
                                    { name: "Роль на снятие", value: `${currole}`, inline: true },
                                    { name: "Запросил", value: `${message.member}`, inline: true },
                                    { name: `Пользователь`, value: `${curuser}`, inline: true },
                                ],
                                timestamp: new Date(),
                            }],
                            components: [row]
                        })
                    }
                })
                return message.delete().catch(() => {})
            } else if (message.member.roles.cache.some(r => (JSON.parse(guild[0].deputy_settings).mafia_leader).includes(r.id))) {
                var role = null, name = null, senators = message.guild.roles.cache.filter(r => (JSON.parse(guild[0].deputy_settings).senators_mafia).some(_r => _r == r.id));
                if (message.member.roles.cache.some(r => ((r.name).toLowerCase()).includes('cosa'))) role = JSON.parse(guild[0].deputy_settings).fractions['lcn'], name = 'La Cosa Nostra'; // La Cosa Nostra
                else if (message.member.roles.cache.some(r => ((r.name).toLowerCase()).includes('russian'))) role = JSON.parse(guild[0].deputy_settings).fractions['rm'], name = 'Russian Mafia'; // Russian Mafia
                else if (message.member.roles.cache.some(r => ((r.name).toLowerCase()).includes('warlock'))) role = JSON.parse(guild[0].deputy_settings).fractions['wmc'], name = 'Warlock MC'; // Warlock MC
                else if (message.member.roles.cache.some(r => ((r.name).toLowerCase()).includes('yakuza'))) role = JSON.parse(guild[0].deputy_settings).fractions['ykz'], name = 'Yakuza'; // Yakuza
                else {
                    message.channel.send({
                        embeds:[{
                            color: 0xE53935,
                            title: `📛 | Ошибка`,
                            description: `\`\`\`Не смог понять на какую фракцию запрашивается роль...\`\`\``,
                        }]
                    }).then((msg) => { setTimeout(() => msg.delete().catch(() => {}), 30000); });
                    return message.delete().catch(() => {})
                }
                var channel = message.guild.channels.cache.find(c => c.id == JSON.parse(guild[0].deputy_settings).mafia_channel);
                if (!channel) {
                    message.channel.send({
                        embeds:[{
                            color: 0xE53935,
                            title: `⚠️ | Ошибка`,
                            description: `\`\`\`Не могу найти канал по выдаче ролей 9 мафий...\`\`\``,
                        }]
                    }).then((msg) => { setTimeout(() => msg.delete().catch(() => {}), 30000); });
                    return message.delete().catch(() => {})
                }
                var currole = message.guild.roles.cache.find(r => r.id == role);
                if (!currole) {
                    message.channel.send({
                        embeds:[{
                            color: 0xE53935,
                            title: `⚠️ | Ошибка`,
                            description: `\`\`\`Роль "${name}" не была найдена на сервере..\`\`\``,
                        }]
                    }).then((msg) => { setTimeout(() => msg.delete().catch(() => {}), 30000); });
                    return message.delete().catch(() => {})
                }
                users.forEach((members) => {
                    var curuser = message.guild.members.cache.get(members.id);
                    if (curuser) {
                        if (!curuser.roles.cache.some(r => (r.id).includes(currole.id))) {
                            message.channel.send({
                                embeds:[{
                                    color: 0xE53935,
                                    title: `📛 | Ошибка`,
                                    description: `**У пользователя ${curuser} нет роли заместителя фракции "${name}"**`,
                                }]
                            }).then((msg) => { setTimeout(() => msg.delete().catch(() => {}), 30000); });
                            return message.delete().catch(() => {})
                        }
                        channel.send({
                            content: `${senators.map(m => `<@&${m.id}>`).join(', ')}`,
                            embeds: [{
                                title: "Снятие роли заместителя",
                                color: 0x93ff54,
                                fields: [
                                    { name: "Роль на снятие", value: `${currole}`, inline: true },
                                    { name: "Запросил", value: `${message.member}`, inline: true },
                                    { name: `Пользователь`, value: `${curuser}`, inline: true },
                                ],
                                timestamp: new Date(),
                            }],
                            components: [row]
                        })
                    }
                })
                return message.delete().catch(() => {})
            }
        });
   	}
}