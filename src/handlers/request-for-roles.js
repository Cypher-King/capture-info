var { MessageActionRow, MessageButton, Permissions, MessageSelectMenu } = require('discord.js'),
    { connection, mod_connection } = require('./connection.js'),
    nrpnames = new Set(),
    sened = new Set(),
    snyatie = new Set();

class Request_For_Roles {
    async send_request(bot, message) {
        if (message.content.toLowerCase().includes("роль") && !message.content.toLowerCase().includes(`снять`) || message.content.toLowerCase().includes("сними") || message.content.toLowerCase().includes("снять")) {
            await connection.query(`SELECT * FROM \`discord_settings\` WHERE \`guild\` = '${message.guild.id}'`, async (error, guild) => {
                if (error || guild.length == 0) { if (error) return console.error(error); else return; };
                if (guild[0].request_module == 0) return;
                if (message.content.toLowerCase().includes("роль") && !message.content.toLowerCase().includes(`снять`)) {
                    if (!(JSON.parse(guild[0].request_settings).available_channels).some(id => id === message.channel.id)) return;
                    if (nrpnames.has(message.member.id)) {
                        if (message.member.roles.cache.some(r => (JSON.parse(guild[0].request_settings).roles_list).includes(r.id))) {
                            for (var i in JSON.parse(guild[0].request_settings).roles_list) {
                                var removerole = bot.guilds.cache.get(g => g.id == message.guild.id).roles.cache.get(r => r.id == (JSON.parse(guild[0].request_settings).roles_list)[i]);
                                if (message.member.roles.cache.some(role => (JSON.parse(guild[0].request_settings).roles_list)[i].includes(role.id))) {
                                    await message.member.roles.remove(removerole);
                                }
                            }
                        }
                        message.react(`📛`);
                        return;
                    }

                    for (var i in JSON.parse(guild[0].request_settings).tagslist) {
                        var nicknametest = message.member.displayName.toLowerCase();
                        nicknametest = nicknametest.replace(/ /g, '');
                        if (nicknametest.includes("[" + JSON.parse(guild[0].request_settings).tagslist[i].replace(/ /g, '').toLowerCase()) || nicknametest.includes(JSON.parse(guild[0].request_settings).tagslist[i].replace(/ /g, '').toLowerCase() + "]") || nicknametest.includes("(" + JSON.parse(guild[0].request_settings).tagslist[i].replace(/ /g, '').toLowerCase()) || nicknametest.includes(JSON.parse(guild[0].request_settings).tagslist[i].replace(/ /g, '').toLowerCase() + ")") || nicknametest.includes("{" + JSON.parse(guild[0].request_settings).tagslist[i].replace(/ /g, '').toLowerCase()) || nicknametest.includes(JSON.parse(guild[0].request_settings).tagslist[i].replace(/ /g, '').toLowerCase() + "}")) {
                            if (nicknametest.includes('ballas') && i == 1) {} else {
                                var roleid = JSON.parse(guild[0].request_settings).rolebytag[JSON.parse(guild[0].request_settings).tagslist[i].toUpperCase()]
                                var role = message.guild.roles.cache.find(r => r.id == roleid);
                                var reqchat = message.guild.channels.cache.find(c => c.id == JSON.parse(guild[0].request_settings).request_channel);
                                if (!role) {
                                    message.reply({
                                        embeds: [{
                                            color: 0xE53935,
                                            title: `⚠️ | Ошибка на стороне сервера`,
                                            description: `**Не смог найти роль "${JSON.parse(guild[0].request_settings).tagslist[i]}" на вашем сервере..**`,
                                            footer: {
                                                text: message.guild.name,
                                                icon_url: message.guild.iconURL() 
                                            }
                                        }]
                                    })
                                    return;
                                } 
                                else if (!reqchat) {
                                    message.reply({
                                        embeds: [{
                                            color: 0xE53935,
                                            title: `⚠️ | Ошибка на стороне сервера`,
                                            description: `**Не смог найти канал для запросов ролей..**`,
                                            footer: {
                                                text: message.guild.name,
                                                icon_url: message.guild.iconURL() 
                                            }
                                        }]
                                    })
                                    return;
                                }
                                if (message.member.roles.cache.some(r => JSON.parse(guild[0].request_settings).roles_list.includes(r.id))) {
                                    message.reply({
                                        embeds: [{
                                            color: 0xE53935,
                                            title: `🤨 | Ошибка запроса`,
                                            description: `**У вас уже и так присутcтвуют роли..\nЧто-бы лишиться своих ролей - пропишите \`/out\`**`,
                                            footer: {
                                                text: message.guild.name,
                                                icon_url: message.guild.iconURL() 
                                            }
                                        }]
                                    })
                                    return;
                                }
                                if (sened.has(message.member.id)){
                                    message.reply({
                                        embeds: [{
                                            color: 0xe3ff7d,
                                            title: `⏳ | Ошибка запроса`,
                                            description: `**Вы уже отправляли запрос на выдачу роли!\nОжидайте проверки..**`,
                                            footer: {
                                                text: message.guild.name,
                                                icon_url: message.guild.iconURL() 
                                            }
                                        }]
                                    })
                                    return;
                                }
                                var mention = message.guild.roles.cache.filter(r => JSON.parse(guild[0].request_settings).rolemoders[role.id].split(', ').some(_r => _r == r.id));
                                var row = new MessageActionRow()
                                .addComponents(
                                    new MessageSelectMenu()
                                        .setCustomId('select')
                                        .setPlaceholder('Выберите дейтсвие')
                                        .addOptions([
                                            {
                                                label: '✅',
                                                description: 'Выдать роль игроку',
                                                value: 'request_plus',
                                            },
                                            {
                                                label: '📨',
                                                description: 'Запросить данные игрока',
                                                value: 'request_check',
                                            },
                                            {
                                                label: '❌',
                                                description: 'Отклонить запрос игрока',
                                                value: 'request_minus',
                                            },
                                            {
                                                label: '🗑️',
                                                description: 'Очистить запрос',
                                                value: 'request_delete',
                                            },
                                        ]),
                                );
                                reqchat.send({
                                    content: `${mention.map(m => `<@&${m.id}>`).join(', ')}`,
                                    embeds: [{
                                        color: role.hexColor ? role.hexColor : 0xab82ff,
                                        title: `**Новый запрос на выдачу роли:**`,
                                        fields: [
                                            { name: `Пользователь:`, value: `${message.author}`, inline: true },
                                            { name: `Никнейм:`, value: `${message.member.displayName || message.member.user.username + message.member.user.tag}`, inline: true },
                                            { name: `Роль:`, value: `${role}`, inline: true },
                                        ],
                                        timestamp: new Date(),
                                        footer: {
                                            text: `${message.member ? `${message.member.id}` : "Неизвестный пользователь"}`,
                                            icon_url: `${message.member ? `${message.member.user.displayAvatarURL({ format: 'png', size: 2048, dynamic: true })}` : ""}`,
                                        }
                                    }],
                                    components: [row]
                                })
                                sened.add(message.member.id);
                                return message.react(`📨`);
                            }
                        }
                    }
                } else if (message.content.toLowerCase().includes("сними") || message.content.toLowerCase().includes("снять")) {
                    if (!message.member.roles.cache.some(r => JSON.parse(guild[0].request_settings).discord_moders.includes(r.id))) return;
                    var args = message.content.split(/ +/)
                    var onebe = false;
                    var twobe = false;
                    args.forEach(word => {
                        if (word.toLowerCase().includes(`роль`)) onebe = true
                        if (word.toLowerCase().includes(`у`)) twobe = true
                    })
                    if (!onebe || !twobe) return;
                    if (message.mentions.users.size > 1) return;
                    var user = message.guild.members.cache.get(message?.mentions?.users?.first()?.id);
                    if (!user) return;
                    var roleremove = user.roles.cache.filter(r => JSON.parse(guild[0].request_settings).roles_list.some(_r => _r == r.id));
                    if (!roleremove.map(m => m.id)[0]) return message.react(`❌`);
                    var permission_role = JSON.parse(guild[0].request_settings).rolemoders[roleremove.map(m => m.id)[0]].split(', ')
                    var dostup_perm = false;
                    for (var i = 0; i < permission_role.length; i++) {
                        if (message.member.roles.cache.some(r => permission_role[i].includes(r.id)) || message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) || message.member.roles.cache.some(r => JSON.parse(guild[0].request_settings).discord_moders.includes(r.id))) dostup_perm = true;
                    }

                    if (!dostup_perm) return;
            
                    message.reply({
                        embeds: [{
                            color: 0xffbf00,
                            description: '**Теперь, укажите в новом сообщении причину снятия роли...**',
                            footer:{
                                text: '🕐 У вас есть минута.'
                            }
                        }]
                    }).then(answer => {
                        var filter = response => {
                            return response?.member?.id == message.member.id
                        };
                        message.channel.awaitMessages({
                            filter,
                            max: 1,
                            time: 1000 * 60,
                            errors: ["time"]
                        }).then(async collected => {
                            user.roles.remove(roleremove.map(m => m.id)[0])
                            .then(async () => {
                                if (JSON.parse(guild[0].request_settings).additional_roles[roleremove.map(m => m.id)[0]]) {
                                    user.roles.remove(message.guild.roles.cache.get(JSON.parse(guild[0].request_settings).additional_roles[roleremove.map(m => m.id)[0]]))
                                    .catch(() => {})
                                }
                                var logs = message.guild.channels.cache.find(c => c.id == JSON.parse(guild[0].request_settings).logs);
                                if (logs) logs.send({
                                    content: `>>> **Пользователь:** <@${message.member.id}>\n\`\`\`diff\n- Снял роль "${roleremove.map(m => m.name)[0]}"\`\`\`**Причина: \`${collected.first().content}\`**\n**Снял:** ${user}\n**————————————**`
                                });
                                mod_connection.query(`SELECT * FROM \`users\` WHERE \`discord\` = '${message.member.id}'`, async (err, mod) => {
                                    if (err) return;
                                    if (mod.length == 0) return;
                                    if (mod[0].level != 0) {
                                        mod_connection.query(`UPDATE \`users\` SET \`roles\` = roles + 1 WHERE \`discord\` = '${message.member.id}'`)
                                    }
                                });
                                await user.send({
                                    embeds: [{
                                        color: 0xf04747,
                                        title: `Снятие фракционной роли`,
                                        description: `**${message.member} снял вашу роль "${roleremove.map(m => m.name)[0]}" по причине: \`${collected.first().content}\`**`,
                                        footer: {
                                            text: message.member.guild.name,
                                            icon_url: message.member.guild.iconURL() 
                                        }
                                    }]
                                })
                                collected.first().delete().catch(() => {});
                                answer.delete().catch(() => {});
                                message.delete().catch(() => {});
                            })
                            .catch(() => {
                                collected.first().delete().catch(() => {});
                                answer.delete().catch(() => {});
                                message.delete().catch(() => {});
                            })
                        })
                        .catch(() => {
                            answer.delete().catch(() => {})
                        });
                    });
                }
            });
        }
    };

    request_menu = async (bot, interaction) => {
        if (!["request_plus", "request_check", "request_minus", "request_delete"].some(id => id == interaction.values)) return;
        var { member, message } = interaction;
        await connection.query(`SELECT * FROM \`discord_settings\` WHERE \`guild\` = '${member.guild.id}'`, async (error, guild) => {
            if (error) {
                console.log(error)
                return await interaction.reply({ content: `${member}, Произошла критическая системная ошибка!`, ephemeral: true })
            }
            if (guild.length === 0) return;
            if (guild[0].request_module == 0) return;
            switch(interaction.values[0]) {
                case "request_plus": {
                    var gguild = bot.guilds.cache.get(member.guild.id);
                    var user = gguild.members.cache.get(message.embeds[0].fields[0].value.replace(/[^a-zа-яё0-9\s]/gi, ''));
                    var roleid = message.embeds[0].fields[2].value.replace(/[^a-zа-яё0-9\s]/gi, '');
                    var moders = JSON.parse(guild[0].request_settings).rolemoders[roleid].split(', ');
                    var access = false;

                    for (var i = 0; i < moders.length; i++) {
                        if (member.roles.cache.some(r => r.id == moders[i]) || member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) access = true;
                    }
                    
                    if (!access) return await interaction.reply({ content: `${member}, недостаточно прав!`, ephemeral: true });
                    if (!user) return await interaction.reply({ content: `${member}, пользователь не найден...`, ephemeral: true });
                    var role = member.guild.roles.cache.get(roleid);
                    if (!role) return await interaction.reply({ content: `${member}, не найдена роль для выдачи!`, ephemeral: true });
                    var logs = member.guild.channels.cache.find(c => c.id == JSON.parse(guild[0].request_settings).logs);
                    user.roles.add(role).then(() => {
                        if (JSON.parse(guild[0].request_settings).additional_roles[roleid]) user.roles.add(gguild.roles.cache.get(JSON.parse(guild[0].request_settings).additional_roles[roleid])) .catch(() => {});
                        if (logs) logs.send({ content: `>>> **Пользователь:** <@${member.id}>\n\`\`\`diff\n+ Выдал роль "${role.name}"\`\`\`**Запросил:** ${user}\n**————————————**` });
                        user.send({
                            embeds: [{
                                color: 0x43b581,
                                title: `Ответ на ваш запрос на выдачу роли`,
                                description: `**Вам успешно была выдана роль "${role.name}"**`,
                                footer: {
                                    text: member.guild.name,
                                    icon_url: member.guild.iconURL() 
                                }
                            }]
                        })
                        message.edit({
                            content: `**${member} одобрил запрос!**`,
                            embeds: [{
                                color: 0x43b581,
                                title: `**Запрос одобрен**`,
                                fields: [
                                    message.embeds[0].fields
                                ],
                                timestamp: new Date(),
                                footer: {
                                    text: `${message.embeds[0].footer.text}`,
                                    icon_url: new URL(message.embeds[0].footer.iconURL),
                                }
                            }],
                            components: []
                        })
                    })
                    .catch(async () => {
                        await interaction.reply({ content: `Ошибка, я не смог выдать роли игроку..`, ephemeral: true })
                    })
                    break;
                };
                case "request_minus": {
                    var gguild = bot.guilds.cache.get(member.guild.id);
                    var roleid = message.embeds[0].fields[2].value.replace(/[^a-zа-яё0-9\s]/gi, '');
                    var moders = JSON.parse(guild[0].request_settings).rolemoders[roleid].split(', ');
                    var access = false;
                    for (var i = 0; i < moders.length; i++) {
                        if (member.roles.cache.some(r => r.id == moders[i]) || member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) access = true;
                    }
                    if (!access) return await interaction.reply({ content: `${member}, недостаточно прав!`, ephemeral: true })
                    var user = gguild.members.cache.get(message.embeds[0].fields[0].value.replace(/[^a-zа-яё0-9\s]/gi, ''));
                    await interaction.reply({ content: `${member}, укажите причину отказа в новом сообщении..`, ephemeral: true }).then(async () => {
                        var filter = response => { return response?.member?.id == member.id };
                        await interaction.channel.awaitMessages({ filter, max: 1, time: 1000 * 60, errors: ["time"] }).then(async answer => {
                            var answ = answer.first();
                            answ.delete().catch(() => {})
                            if (user) user.send({
                                embeds: [{
                                    color: 0xf04747,
                                    title: `Ответ на ваш запрос на выдачу роли`,
                                    description: `**Ваш запрос был отклонен ${member} по причине:\n\`\`\`${answ.content}\`\`\`**`,
                                    footer: {
                                        text: member.guild.name,
                                        icon_url: member.guild.iconURL() 
                                    }
                                }]
                            }).catch(() => {});
                            message.edit({
                                content: `${member} отконил запрос по причине \`${answ.content}\``,
                                embeds: [{
                                    color: 0xf04747,
                                    title: `**Запрос отклонен...**`,
                                    fields: [
                                        message.embeds[0].fields
                                    ],
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${message.embeds[0].footer.text}`,
                                        icon_url: new URL(message.embeds[0].footer.iconURL),
                                    }
                                }],
                                components: [],
                            })
                            .then(async () => {
                                await interaction.followUp({ content: `${member}, Вы успешно отклонили запрос пользователя ${user}`, ephemeral: true })
                            })
                        }).catch(async (err) => {
                            return await interaction.followUp({ content: `${member}, произошла ошибка, но сообщение вроде отправлено..`, ephemeral: true })
                        });
                    });
                    break;
                };
                case "request_delete": {
                    var roleid = message.embeds[0].fields[2].value.replace(/[^a-zа-яё0-9\s]/gi, '');
                    var moders = JSON.parse(guild[0].request_settings).rolemoders[roleid].split(', ');
                    var access = false;
                    for (var i = 0; i < moders.length; i++) {
                        if (member.roles.cache.some(r => r.id == moders[i]) || member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) access = true;
                    }
                    if (!access) return await interaction.reply({ content: `${member}, недостаточно прав!`, ephemeral: true });
                    message.edit({
                        content: `${member} очистил запрос`,
                        embeds: [{
                            color: 0x36393F,
                            title: `**Запрос очищен...**`,
                            fields: [
                                message.embeds[0].fields
                            ],
                            timestamp: new Date(),
                            footer: {
                                text: `${message.embeds[0].footer.text}`,
                                icon_url: new URL(message.embeds[0].footer.iconURL),
                            }
                        }],
                        components: []
                    }).then(async () => {
                        await interaction.reply({ content: `${member}, Вы успешно очистили запрос!`, ephemeral: true })
                    })
                    break;
                };
                case "request_check": {
                    var gguild = bot.guilds.cache.get(member.guild.id);
                    var roleid = message.embeds[0].fields[2].value.replace(/[^a-zа-яё0-9\s]/gi, '');
                    var moders = JSON.parse(guild[0].request_settings).rolemoders[roleid].split(', ');
                    var access = false;
                    for (var i = 0; i < moders.length; i++) {
                        if (member.roles.cache.some(r => r.id == moders[i]) || member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) access = true;
                    }
                    if (!access) return await interaction.reply({ content: `${member}, недостаточно прав!`, ephemeral: true })
                    if (message.embeds[0].title == '**Данные запрошены...**') return await interaction.reply({ content: `Данные уже запрошены!`, ephemeral: true })
                    var user = gguild.members.cache.get(message.embeds[0].fields[0].value.replace(/[^a-zа-яё0-9\s]/gi, ''));
                    if (!user) return await interaction.reply({ content: `${member}, пользователь не найден...`, ephemeral: true })
                    user.send({
                        embeds: [{
                            color: 0x4f5d7e,
                            title: `Ответ на ваш запрос на выдачу роли`,
                            description: `**Предоставьте ${member} скриншот вашего аккаунта: (\`/stats\` + \`/time\`)**`,
                            footer: {
                                text: member.guild.name,
                                icon_url: member.guild.iconURL() 
                            }
                        }]
                    }).catch(() => {});
                    var row = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('select')
                            .setPlaceholder('Выберите дейтсвие')
                            .addOptions([
                                {
                                    label: '✅',
                                    description: 'Выдать роль игроку',
                                    value: 'request_plus',
                                },
                                {
                                    label: '❌',
                                    description: 'Отклонить запрос игрока',
                                    value: 'request_minus',
                                },
                                {
                                    label: '🗑️',
                                    description: 'Очистить запрос',
                                    value: 'request_delete',
                                },
                            ]),
                    );
                    message.edit({
                        content: `${member} запросил данные..`,
                        embeds: [{
                            color: 0xf9a62b,
                            title: `**Данные запрошены...**`,
                            fields: [
                                message.embeds[0].fields
                            ],
                            timestamp: new Date(),
                            footer: {
                                text: `${message.embeds[0].footer.text}`,
                                icon_url: new URL(message.embeds[0].footer.iconURL),
                            }
                        }],
                        components: [row]
                    })
                    .then(async () => {
                        await interaction.reply({ content: `${member}, Пользователю было отправлено сообщени об просьбе отправить вам данные своего аккаунта: (\`/stats\` + \`/time\`)`, ephemeral: true })
                    })
                    break;
                }
                default: break;
            };
        });
    };
};

module.exports = new Request_For_Roles();