'use strict';

var { MessageActionRow, MessageButton, Permissions } = require('discord.js'),
    TelegramBot = require('node-telegram-bot-api'),
    { connection, vk_connection, tg_connection } = require('../handlers/connection'),
    { private_buttons, roles9_list } = require('../handlers/index'),
    { get_mysql_servername, get_dsmysql_servername } = require('../utils/index.ts'),
    { request_menu } = require('../handlers/request-for-roles.js'),
    VK = require('node-vk-bot-api'),
    vk =  new VK({ token: process.env.vk_token }),
    tgbot = new TelegramBot(process.env.telegram_token);

module.exports = async (bot, interaction) => {
    if (interaction.isButton()) {
        await private_buttons(bot, interaction);
        var member = interaction.member;
        connection.query(`SELECT * FROM \`discord_settings\` WHERE \`guild\` = '${member.guild.id}'`, async (error, guild) => {
            if (error || guild.length == 0) { if (error) { return console.log(error); } else return };
            var channel = member.guild.channels.cache.find(c => c.id == interaction.message.channel.id); 
            var message = await channel.messages.fetch(interaction.message.id); 
            if (interaction.customId == "capture_minus" || interaction.customId == "capture_clear" || interaction.customId == "capture_plus") {
                if (message.mentions?.users.map(x => x).length == 0) return;
                var guildMember = member.guild.members.cache.get(message.mentions?.users?.first().id);
                var capttext = message.content.split(" ").slice(1).join(" ");
                if (channel.id != guild[0].capture_from) return;
                var capt_channel = member.guild.channels.cache.find(c => c.id == guild[0].capture_to);
                if (!capt_channel) {
                    if (interaction.customId != "capture_minus" || interaction.customId != "capture_clear") {
                        await interaction.reply({ embeds: [{ color: 0xE53935, title: `📛 | Ошибка`, description: `**Канал #capture-info не найден!**` }], ephemeral: true })
                        return;
                    }
                }
                if (!member.roles.cache.some(r => JSON.parse(guild[0].capt_moders).includes(r.id))) { 
                    if (!member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ embeds: [{ color: 0xE53935, title: `📛 | Ошибка`, description: `**Недостаточно прав!**` }], ephemeral: true });
                }
                switch (interaction.customId) {
                    case "capture_plus": {
                        capt_channel.send({ 
                            embeds: [{
                                author: {   
                                    name: member.guild.name,  
                                    icon_url: member.guild.iconURL()  
                                },  
                                color: ((guildMember.roles.member.roles).length != 0) ? guildMember.roles.color.hexColor : 0xfffcf5,
                                thumbnail: { url: guildMember.user.displayAvatarURL({ format: 'png', size: 2048, dynamic: true }) },  
                                description: `**${guildMember}:\n\`\`\`${capttext}\`\`\`${member} - одобрено**`,  
                                footer: {   
                                    text: `Одобрил: ${member.displayName || member.user.username + member.user.tag}`,   
                                    icon_url: member.user.displayAvatarURL({ format: 'png', size: 2048, dynamic: true })  
                                },  
                                timestamp: new Date()  
                            }] 
                        })
                        .then(() => {
                            message.edit({
                                content: null,
                                embeds:[{ 
                                    color: 0x93ff54,    
                                    title: '✅ | Информация об забиве', 
                                    description: `**Забил: ${guildMember}:\n\`\`\`\n${capttext}\`\`\`${member} - одобрено**`, 
                                    timestamp: new Date()   
                                }],
                                components: [],
                            })
                        })
                        break;
                    };
                    case "capture_minus": {
                        message.edit({
                            content: null,
                            embeds:[{ 
                                color: 0xE53935,    
                                title: '❌ | Информация об забиве', 
                                description: `**Забил: ${guildMember}:\n\`\`\`\n${capttext}\`\`\`${member} - отклонено**`, 
                                timestamp: new Date()   
                            }],
                            components: [],
                        })   
                        break;
                    };
                    case "capture_clear": {
                        message.edit({
                            content: null,
                            embeds:[{ 
                                color: 0x4F545C,    
                                title: '💾 | Информация об забиве', 
                                description: `**Забил: ${guildMember}:\n\`\`\`\n${capttext}\`\`\`${member} - очистил кнопки**`, 
                                timestamp: new Date()   
                            }],
                            components: [],
                        }) 
                        break;
                    };
                    default: break;
                }
            } else if (interaction.customId == "strela_22" || interaction.customId == "strela_33" || interaction.customId == "strela_44" || interaction.customId == "strela_55" || interaction.customId == "strela_minus" || interaction.customId == "strela_clear" || interaction.customId == "strela_plus") {
                if (message.mentions?.users.map(x => x).length == 0) return;
                var guildMember = member.guild.members.cache.get(message.mentions.users.first().id);
                var capttext = message.content.split(" ").slice(1).join(" ");
                if (channel.id != guild[0].strel_from) return;
                var strel_channel = member.guild.channels.cache.find(c => c.id == guild[0].strel_to);
                if (!strel_channel) {
                    if (interaction.customId != "strela_22" || interaction.customId != "strela_33" || interaction.customId != "strela_44" || interaction.customId != "strela_55" || interaction.customId == "strela_plus") {
                        interaction.reply({ embeds: [{ color: 0xE53935, title: `📛 | Ошибка`, description: `**Канал #strel-info не найден!**` }], ephemeral: true })
                        return;
                    }
                }
                switch (interaction.customId) {
                    case "strela_plus": {
                        strel_channel.send({ 
                            embeds: [{
                                author: {   
                                    name: member.guild.name,  
                                    icon_url: member.guild.iconURL()  
                                },  
                                color: ((member.roles.member._roles).length != 0) ? member.roles.color.hexColor : 0xfffcf5,
                                thumbnail: { url: guildMember.user.displayAvatarURL({ format: 'png', size: 2048, dynamic: true }) },  
                                description: `**${guildMember}:\n\`\`\`${capttext}\`\`\`${member} - Принял стрелу**`,  
                                footer: {   
                                    text: `Принял: ${member.displayName || member.user.username + member.user.tag}`,   
                                    icon_url: member.user.displayAvatarURL({ format: 'png', size: 2048, dynamic: true })  
                                },  
                                timestamp: new Date()  
                            }] 
                        })
                        .then(() => {
                            message.edit({
                                content: null,
                                embeds:[{ 
                                    color: 0x93ff54,    
                                    title: '✅ | Информация об забиве', 
                                    description: `**Забил: ${guildMember}:\n\`\`\`\n${capttext}\`\`\`${member} - Принял**`, 
                                    timestamp: new Date()   
                                }],
                                components: [],
                                ephemeral: true
                            })
                        });
                        break;
                    };
                    case "strela_22": {
                        strel_channel.send({ 
                            embeds: [{
                                author: {   
                                    name: member.guild.name,  
                                    icon_url: member.guild.iconURL()  
                                },  
                                color: ((member.roles.member._roles).length != 0) ? member.roles.color.hexColor : 0xfffcf5,
                                thumbnail: { url: guildMember.user.displayAvatarURL({ format: 'png', size: 2048, dynamic: true }) },  
                                description: `**${guildMember}:\n\`\`\`${capttext}\`\`\`${member} - Принял стрелу 2 на 2**`,  
                                footer: {   
                                    text: `Принял: ${member.displayName || member.user.username + member.user.tag}`,   
                                    icon_url: member.user.displayAvatarURL({ format: 'png', size: 2048, dynamic: true })  
                                },  
                                timestamp: new Date()  
                            }] 
                        })
                        .then(() => {
                            message.edit({
                                content: null,
                                embeds:[{ 
                                    color: 0x93ff54,    
                                    title: '✅ | Информация об забиве', 
                                    description: `**Забил: ${guildMember}:\n\`\`\`\n${capttext}\`\`\`${member} - Принял стрелу 2 на 2**`, 
                                    timestamp: new Date()   
                                }],
                                components: [],
                            })
                        });
                        break;
                    };
                    case "strela_33": {
                        strel_channel.send({ 
                            embeds: [{
                                author: {   
                                    name: member.guild.name,  
                                    icon_url: member.guild.iconURL()  
                                },  
                                color: ((member.roles.member._roles).length != 0) ? member.roles.color.hexColor : 0xfffcf5,
                                thumbnail: { url: guildMember.user.displayAvatarURL({ format: 'png', size: 2048, dynamic: true }) },  
                                description: `**${guildMember}:\n\`\`\`${capttext}\`\`\`${member} - Принял стрелу 3 на 3**`,  
                                footer: {   
                                    text: `Принял: ${member.displayName || member.user.username + member.user.tag}`,   
                                    icon_url: member.user.displayAvatarURL({ format: 'png', size: 2048, dynamic: true })  
                                },  
                                timestamp: new Date()  
                            }] 
                        })
                        .then(() => {
                            message.edit({
                                content: null,
                                embeds:[{ 
                                    color: 0x93ff54,    
                                    title: '✅ | Информация об забиве', 
                                    description: `**Забил: ${guildMember}:\n\`\`\`\n${capttext}\`\`\`${member} - Принял стрелу 3 на 3**`, 
                                    timestamp: new Date()   
                                }],
                                components: [],
                                ephemeral: true
                            })
                        });
                        break;
                    };
                    case "strela_44": {
                        strel_channel.send({ 
                            embeds: [{
                                author: {   
                                    name: member.guild.name,  
                                    icon_url: member.guild.iconURL()  
                                },  
                                color: ((member.roles.member._roles).length != 0) ? member.roles.color.hexColor : 0xfffcf5,
                                thumbnail: { url: guildMember.user.displayAvatarURL({ format: 'png', size: 2048, dynamic: true }) },  
                                description: `**${guildMember}:\n\`\`\`${capttext}\`\`\`${member} - Принял стрелу 4 на 4**`,  
                                footer: {   
                                    text: `Принял: ${member.displayName || member.user.username + member.user.tag}`,   
                                    icon_url: member.user.displayAvatarURL({ format: 'png', size: 2048, dynamic: true })  
                                },  
                                timestamp: new Date()  
                            }] 
                        })
                        .then(() => {
                            message.edit({
                                content: null,
                                embeds:[{ 
                                    color: 0x93ff54,    
                                    title: '✅ | Информация об забиве', 
                                    description: `**Забил: ${guildMember}:\n\`\`\`\n${capttext}\`\`\`${member} - Принял стрелу 4 на 4**`, 
                                    timestamp: new Date()   
                                }],
                                components: [],
                                ephemeral: true
                            })
                        });
                        break;
                    };
                    case "strela_55": {
                        strel_channel.send({ 
                            embeds: [{
                                author: {   
                                    name: member.guild.name,  
                                    icon_url: member.guild.iconURL()  
                                },  
                                color: ((member.roles.member._roles).length != 0) ? member.roles.color.hexColor : 0xfffcf5,
                                thumbnail: { url: guildMember.user.displayAvatarURL({ format: 'png', size: 2048, dynamic: true }) },  
                                description: `**${guildMember}:\n\`\`\`${capttext}\`\`\`${member} - Принял стрелу 5 на 5**`,  
                                footer: {   
                                    text: `Принял: ${member.displayName || member.user.username + member.user.tag}`,   
                                    icon_url: member.user.displayAvatarURL({ format: 'png', size: 2048, dynamic: true })  
                                },  
                                timestamp: new Date()  
                            }] 
                        })
                        .then(() => {
                            message.edit({
                                content: null,
                                embeds:[{ 
                                    color: 0x93ff54,    
                                    title: '✅ | Информация об забиве', 
                                    description: `**Забил: ${guildMember}:\n\`\`\`\n${capttext}\`\`\`${member} - Принял стрелу 5 на 5**`, 
                                    timestamp: new Date()   
                                }],
                                components: [],
                                ephemeral: true
                            })
                        });
                        break;
                    };
                    case "strela_minus": {
                        message.edit({
                            content: null,
                            embeds:[{ 
                                color: 0xE53935,    
                                title: '❌ | Информация об забиве', 
                                description: `**Забил: ${guildMember}:\n\`\`\`\n${capttext}\`\`\`${member} - отклонено**`, 
                                timestamp: new Date()   
                            }],
                            components: [],
                            ephemeral: true
                        })  
                        break;
                    };
                    case "strela_clear": {
                        message.edit({
                            content: null,
                            embeds:[{ 
                                color: 0x4F545C,    
                                title: '💾 | Информация об забиве', 
                                description: `**Забил: ${guildMember}:\n\`\`\`\n${capttext}\`\`\`${member} - очистил кнопки**`, 
                                timestamp: new Date()   
                            }],
                            components: [],
                            ephemeral: true
                        }) 
                        break;
                    };
                    default: break;
                }
            } else if (interaction.customId == "anketa_plus" || interaction.customId == "anketa_minus") {
                var _channels = ["893012932860993583", "683381028626104533", "926474491704520742"]
                if (!_channels.some(chann => chann == message.channel.id)) return;
                if (!member.roles.cache.some(r => JSON.parse(guild[0].anketa_moders).includes(r.id))) { 
                    if (!member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ embeds: [{ color: 0xE53935, title: `📛 | Ошибка`, description: `**Недостаточно прав!**` }], ephemeral: true });
                }
                switch(interaction.customId) {
                    case "anketa_plus": {
                        var owner; var user;
                        if (message.embeds[0].author.url) {
                            var membid = (message.embeds[0].author.url.replace("https://discord.com/channels/@me/", "")).replace(/\s/g, ''); 
                            var anketmemb = member.guild.members.cache.get(membid);
                            if (!anketmemb) owner = false; else owner = anketmemb;
                        } else owner = false;
                        if (message.embeds[0].url) {
                            var membid = (message.embeds[0].url.replace("https://discord.com/channels/@me/", "")).replace(/\s/g, ''); 
                            var anketmemb = member.guild.members.cache.get(membid);
                            if (!anketmemb) user = false; else user = anketmemb;
                        } else user = false;
                        message.edit({
                            content: null,
                            embeds: [{
                                color: 0x93ff54,
                                description: `\`\`\`diff\n+ Анкета одобрена ${member.displayName || member.user.username + member.user.tag}\`\`\`\n${message.embeds[0].description}`,
                                title: `${message.embeds[0].title}`,
                                url: `${message.embeds[0].url ? message.embeds[0].url : ""}`,
                                author: {
                                    name: `${owner ? owner.displayName || owner.user.username + owner.user.tag : 'Неизвестный пользователь'}`,   
                                    icon_url: owner ? owner.user.displayAvatarURL({ format: 'png', size: 2048, dynamic: true }) : "",
                                    url: owner ? `https://discord.com/channels/@me/${owner.id}` : ""
                                },
                                footer: {
                                    text: `${user ? `${user.displayName || user.user.username + user.user.tag}` : "Неизвестный пользователь"}`,
                                    icon_url: `${user ? `${user.user.displayAvatarURL({ format: 'png', size: 2048, dynamic: true })}` : ""}`,
                                }
                            }],
                            components: [],
                        }).catch(async (error) => {
                            await interaction.reply({ embeds: [{ color: 0xE53935, title: `📛 | Ошибка`, description: `**Произошла ошибка, уведомите об этом разработчиков!**` }], ephemeral: true });
                        })
                        break;
                    };
                    case "anketa_minus": {
                        var owner; var user;
                        if (message.embeds[0].author.url) {
                            var membid = (message.embeds[0].author.url.replace("https://discord.com/channels/@me/", "")).replace(/\s/g, ''); 
                            var anketmemb = member.guild.members.cache.get(membid);
                            if (!anketmemb) owner = false; else owner = anketmemb;
                        } else owner = false;
                        if (message.embeds[0].url) {
                            var membid = (message.embeds[0].url.replace("https://discord.com/channels/@me/", "")).replace(/\s/g, ''); 
                            var anketmemb = member.guild.members.cache.get(membid);
                            if (!anketmemb) user = false; else user = anketmemb;
                        } else user = false;
                        message.edit({
                            content: null,
                            embeds: [{
                                color: 0xE53935,
                                description: `\`\`\`diff\n- Анкета отклонена ${member.displayName || member.user.username + member.user.tag}\`\`\`\n${message.embeds[0].description}`,
                                title: `${message.embeds[0].title}`,
                                url: `${message.embeds[0].url ? message.embeds[0].url : ""}`,
                                author: {
                                    name: `${owner ? owner.displayName || owner.user.username + owner.user.tag : 'Неизвестный пользователь'}`,   
                                    icon_url: owner ? owner.user.displayAvatarURL({ format: 'png', size: 2048, dynamic: true }) : "",
                                    url: owner ? `https://discord.com/channels/@me/${owner.id}` : ""
                                },
                                footer: {
                                    text: `${user ? `${user.displayName || user.user.username + user.user.tag}` : "Неизвестный пользователь"}`,
                                    icon_url: `${user ? `${user.user.displayAvatarURL({ format: 'png', size: 2048, dynamic: true })}` : ""}`,
                                }
                            }],
                            components: [],
                        }).catch(async (error) => {
                            await interaction.reply({ embeds: [{ color: 0xE53935, title: `📛 | Ошибка`, description: `**Произошла ошибка, уведомите об этом разработчиков!**` }], ephemeral: true });
                        })
                        break;
                    }
                    default: break;
                }
            }
        });
    } else if (interaction.isCommand()) {
        // var command = bot.commands.get(interaction.commandName);
        // if (!command) return;
        // try {
        //     await command.run(bot, interaction);
        // } catch (error) {
        //     console.error(error);
        //     await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        // }
    } else if (interaction.isSelectMenu()) {
        await request_menu(bot, interaction);
        await roles9_list(bot, interaction);
    }
};