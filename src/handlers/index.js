'use strict';

var { MessageActionRow, MessageButton, Permissions, MessageSelectMenu } = require('discord.js'),
    { connection } = require('./connection.js'),
    { isAN } = require('../utils/index.ts');

class CaptureSystems {
    check_new_capture = async (bot, message) => {
        if (message.content.toLowerCase().includes('забив') || message.content.toLowerCase().includes('капт') || message.content.toLowerCase().includes('мороз') || message.content.toLowerCase().includes('капчу') || message.content.toLowerCase().includes('отбив') || message.content.toLowerCase().includes('откат')) {
            connection.query(`SELECT * FROM \`discord_settings\` WHERE \`guild\` = '${message.guild.id}'`, async (error, guild) => {
                if (error || guild.length == 0) { if (error) return console.error(error); else return; };
                if (guild[0].enable_captureinfo == 0 || message.channel.id != guild[0].capture_from) return;
                var row = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId('capture_plus')
                        // .setLabel('Одобрить')
                        .setEmoji(`✅`)
                        .setStyle('SUCCESS'),
                    new MessageButton()
                        .setCustomId('capture_minus')
                        // .setLabel('Отклонить')
                        .setEmoji(`❌`)
                        .setStyle('DANGER'),
                    new MessageButton()
                        .setCustomId('capture_clear')
                        // .setLabel('Очистить')
                        .setEmoji(`🇩`)
                        .setStyle('SECONDARY')
                );
                message.channel.send({ 
                    content: `${message.author}: ${message.content}`,
                    components: [row]
                })
                return message.delete().catch(() => {})
                .catch(() => { });
            })
        }
    };

    check_new_strela = async (bot, message) => {
        if ((message.content.toLowerCase().includes('забив') || message.content.toLowerCase().includes('стрелу') || message.content.toLowerCase().includes('мороз') || message.content.toLowerCase().includes('откат') || message.content.toLowerCase().includes('отбив'))) {
            await connection.query(`SELECT * FROM \`discord_settings\` WHERE \`guild\` = '${message.guild.id}'`, async (error, guild) => {
                if (error || guild.length == 0) { if (error) return console.error(error); else return; };
                if (guild[0].enable_strelinfo == 1) {
                    if (message.channel.id != guild[0].strel_from) return;
                    var row = new MessageActionRow().addComponents(
                        new MessageButton()
                            .setCustomId('strela_22')
                            .setLabel('2 x 2')
                            .setStyle('SUCCESS'),
                        new MessageButton()
                            .setCustomId('strela_33')
                            .setLabel('3 x 3')
                            .setStyle('SUCCESS'),
                        new MessageButton()
                            .setCustomId('strela_44')
                            .setLabel('4 x 4')
                            .setStyle('SUCCESS'),
                        new MessageButton()
                            .setCustomId('strela_55')
                            .setLabel('5 x 5')
                            .setStyle('SUCCESS'),
                    );
                    var row2 = new MessageActionRow().addComponents(
                        new MessageButton()
                            .setCustomId('strela_minus')
                            .setEmoji(`❌`)
                            .setStyle('DANGER'),
                        new MessageButton()
                            .setCustomId('strela_clear')
                            .setEmoji(`🇩`)
                            .setStyle('SECONDARY'),
                    )
                    var row3 = new MessageActionRow().addComponents(
                        new MessageButton()
                            .setCustomId('strela_plus')
                            .setEmoji(`✅`)
                            .setStyle('SUCCESS'),
                        new MessageButton()
                            .setCustomId('strela_minus')
                            .setEmoji(`❌`)
                            .setStyle('DANGER'),
                        new MessageButton()
                            .setCustomId('strela_clear')
                            .setEmoji(`🇩`)
                            .setStyle('SECONDARY'),
                    )
                    message.channel.send({ 
                        content: `${message.author}: ${message.content}`,
                        components: guild[0].strel_type === 1 ? [row3] : [row, row2]
                    })
                    return message.delete().catch(() => { });
                }
            });
        }
    };

    anketa_winslow = async (bot, message) => {
        var _channels = ["893012932860993583", "683381028626104533", "926474491704520742"]
        if (_channels.some(chann => chann == message.channel.id)) {
            // if (!message.content.toLowerCase().includes('имя') || !message.content.toLowerCase().includes('ник')) return;
            var rightForm = form(message.content, message.channel.id);
            let massiv = message.content.split('\n');
            if (rightForm) {
                await connection.query(`SELECT * FROM \`discord_settings\` WHERE \`guild\` = '${message.guild.id}'`, async (error, guild) => {
                    if (error) return console.log(error)
                    if (guild.length == 0) return;
                    var senators_id = JSON.parse(guild[0].anketa_moders);
                    if (message.channel.id === '893012932860993583') {
                        if(!massiv[0].includes('_')) {
                            message.member.send({
                                embeds: [{
                                    color: 0xE53935,    
                                    title: '❌ | Ошибка', 
                                    description: `**В пункте #1 ник не по форме!**`, 
                                    timestamp: new Date() 
                                }]
                            })
                            return message.react('⚠️');
                        }
                        if(!massiv[2].includes('_')){
                            message.member.send({
                                embeds: [{
                                    color: 0xE53935,    
                                    title: '❌ | Ошибка', 
                                    description: `**В пункте #3 ник не по форме!**`, 
                                    timestamp: new Date() 
                                }]
                            })
                            return message.react('⚠️');
                        }
                    } else if (message.channel.id === '683381028626104533') {
                        if(!massiv[0].includes('_')){
                            message.member.send({
                                embeds: [{
                                    color: 0xE53935,    
                                    title: '❌ | Ошибка', 
                                    description: `**В пункте #1 ник не по форме!**`, 
                                    timestamp: new Date() 
                                }]
                            })
                            return message.react('⚠️');
                        }
                        if(!massiv[3].includes('_')){
                            message.member.send({
                                embeds: [{
                                    color: 0xE53935,    
                                    title: '❌ | Ошибка', 
                                    description: `**В пункте #4 ник не по форме!**`, 
                                    timestamp: new Date() 
                                }]
                            })
                            return message.react('⚠️');
                        }
                        if(!massiv[5].includes('forum.arizona-rp.com')){
                            message.member.send({
                                embeds: [{
                                    color: 0xE53935,    
                                    title: '❌ | Ошибка', 
                                    description: `**В пункте #4 ник не по форме!**`, 
                                    timestamp: new Date() 
                                }]
                            })
                            return message.react('⚠️');
                        }
                        if(!massiv[6].includes('vk.com')){
                            message.member.send({
                                embeds: [{
                                    color: 0xE53935,    
                                    title: '❌ | Ошибка', 
                                    description: `**В пункте #4 ник не по форме!**`, 
                                    timestamp: new Date() 
                                }]
                            })
                            return message.react('⚠️');
                        }
                    } else if (message.channel.id === '926474491704520742') {
                        if(!massiv[0].includes('_')){
                            message.member.send({
                                embeds: [{
                                    color: 0xE53935,    
                                    title: '❌ | Ошибка', 
                                    description: `**В пункте #1 ник не по форме!**`, 
                                    timestamp: new Date() 
                                }]
                            })
                            return message.react('⚠️');
                        }
                        if(!massiv[3].includes('_')){
                            message.member.send({
                                embeds: [{
                                    color: 0xE53935,    
                                    title: '❌ | Ошибка', 
                                    description: `**В пункте #4 ник не по форме!**`, 
                                    timestamp: new Date() 
                                }]
                            })
                            return message.react('⚠️');
                        }
                        if(!massiv[5].includes('forum.arizona-rp.com')){
                            message.member.send({
                                embeds: [{
                                    color: 0xE53935,    
                                    title: '❌ | Ошибка', 
                                    description: `**В пункте #4 ник не по форме!**`, 
                                    timestamp: new Date() 
                                }]
                            })
                            return message.react('⚠️');
                        }
                        if(!massiv[6].includes('vk.com')){
                            message.member.send({
                                embeds: [{
                                    color: 0xE53935,    
                                    title: '❌ | Ошибка', 
                                    description: `**В пункте #4 ВК не по форме!**`, 
                                    timestamp: new Date() 
                                }]
                            })
                            return message.react('⚠️');
                        }
                    }
                    
                    var user;
                    if (message.mentions?.users.map(x => x).length == 0) user = false;
                    else user = message.guild.members.cache.get(message.mentions.users.first().id);
                    if (!user) user = false;
                    var row = new MessageActionRow().addComponents(
                        new MessageButton()
                            .setCustomId('anketa_plus')
                            .setEmoji(`✅`)
                            .setStyle('SUCCESS'),
                        new MessageButton()
                            .setCustomId('anketa_minus')
                            .setEmoji(`❌`)
                            .setStyle('DANGER'),
                    );
                    var anketa_type;
                    if (message.content.includes('Почему именно он')) anketa_type = 'Анкета на постановление заместителя:';
                    else if (message.content.includes('Причина снятия')) anketa_type = 'Анкета на снятие заместителя:';
                    else if (message.content.toLowerCase().includes('поставил')) anketa_type = 'Анкета на постановление заместителя:';
                    else if (message.content.toLowerCase().includes('снял')) anketa_type = 'Анкета на постановление заместителя:';
                    else anketa_type = 'Форма анкеты не определена'
                    var senators = message.guild.roles.cache.filter(r => senators_id.some(_r => _r == r.id));
                    message.channel.send({
                        content: `${message.author} отправил новую анкету ${senators.map(m => `<@&${m.id}>`).join(', ')}!`,
                        embeds: [{
                            color: 0xfdc2ff,
                            description: `${message.content}`,
                            title: `${anketa_type}`,
                            url: `${user ? `https://discord.com/channels/@me/${user.id}` : ``}`,
                            author: {
                                name: `${message.member.displayName || message.member.user.username + message.member.user.tag}`,   
                                icon_url: message.member.user.displayAvatarURL({ format: 'png', size: 2048, dynamic: true }),
                                url: `https://discord.com/channels/@me/${message.author.id}`  
                            },
                            footer: {
                                text: `${user ? `${user.displayName || user.user.username + user.user.tag}` : "Неизвестный пользователь"}`,
                                icon_url: `${user ? `${user.user.displayAvatarURL({ format: 'png', size: 2048, dynamic: true })}` : ""}`,
                            }
                        }],
                        components: [row]
                    })
                    return message.delete().catch(() => {});
                });
            }
        }
    };



    private_buttons = async (bot, interaction) => {
        var member = interaction.member;
        var message = interaction.message
        connection.query(`SELECT * FROM \`discord_settings\` WHERE \`guild\` = '${member.guild.id}'`, async (error, guild) => {
            if (error || guild.length == 0) { if (error) { return console.log(error); } else return };
            connection.query(`SELECT * FROM \`discord_privates\` WHERE \`guild\` = '${member.guild.id}' AND \`author\` = '${member.id}'`, async (err, privatesql) => {
                if (err || privatesql.length == 0) { if (err) { return console.log(err); } else return };
                switch(interaction.customId) {
                    case "voice_delete": {
                        if (!member.voice.channel) return await interaction.reply({ content: `Вы отсутствуете в голосовом канале!`, ephemeral: true })
                        if (member.voice.channel.parentId != JSON.parse(guild[0].private_settings).category_id) return await interaction.reply({ content: `Голосовой канал не соответствует приват комнат!`, ephemeral: true })
                        connection.query(`SELECT * FROM \`discord_privates\` WHERE \`voice_channel\` = '${member.voice.channel.id}'`, async (err, result) => {
                            if (err) {
                                console.log(err)
                                return await interaction.reply({ content: `Произошла критическая системная ошибка!`, ephemeral: true })
                            }
                            if (result.length == 0) return await interaction.reply({ content: `Данный канал не найден в базе данных...`, ephemeral: true });
                            else {
                                if (result[0].text_channel != message.channel.id) return await interaction.reply({ content: `Приват комнатами Вы можете управлять только в канале <#${result[0].text_channel}>`, ephemeral: true });
                                else if (result[0].author != member.id) return await interaction.reply({ content: `Приват комнатами может управлять только создатель приват канала <@${result[0].author}>`, ephemeral: true });
                                else if (member.voice.channel.id != result[0].voice_channel) return await interaction.reply({ content: `Вы находитесь не в приват канале`, ephemeral: true });
                                var channel_voice = member.guild.channels.cache.get(result[0].voice_channel)
                                var channel_text = member.guild.channels.cache.get(result[0].text_channel)
                                if (channel_voice) {
                                    connection.query(`DELETE FROM \`discord_privates\` WHERE \`voice_channel\` = '${channel_voice.id}'`)
                                    channel_voice.delete().catch(() => {})
                                    .catch(() => {})
                                }
                                if (channel_text) channel_text.delete().catch(() => {});
                            }
                        });
                        break;
                    };
                    case "voice_kick": {
                        if (!member.voice.channel) return await interaction.reply({ content: `Вы отсутствуете в голосовом канале!`, ephemeral: true })
                        if (member.voice.channel.parentId != JSON.parse(guild[0].private_settings).category_id) return await interaction.reply({ content: `Голосовой канал не соответствует приват комнат!`, ephemeral: true })
                        connection.query(`SELECT * FROM \`discord_privates\` WHERE \`voice_channel\` = '${member.voice.channel.id}'`, async (err, result) => {
                            if (err) {
                                console.log(err)
                                return await interaction.reply({ content: `Произошла критическая системная ошибка!`, ephemeral: true })
                            }
                            if (result.length == 0)return await interaction.reply({ content: `Данный канал не найден в базе данных...`, ephemeral: true });
                            else {
                                if (result[0].text_channel != message.channel.id) return await interaction.reply({ content: `Приват комнатами Вы можете управлять только в канале <#${result[0].text_channel}>`, ephemeral: true });
                                else if (result[0].author != member.id) return await interaction.reply({ content: `Приват комнатами может управлять только создатель приват канала <@${result[0].author}>`, ephemeral: true });
                                else if (member.voice.channel.id != result[0].voice_channel) return await interaction.reply({ content: `Вы находитесь не в приват канале`, ephemeral: true });
                                var channel = member.guild.channels.cache.get(result[0].voice_channel)
                                await interaction.reply({ content: `${member}, упомяните участников, которых хотите забрать доступ к приват комнате! У вас на это минута`, ephemeral: true }).then(async () => {
                                    const filter = response => {
                                        return response?.member?.id == member.id
                                    }
                                    await interaction.channel.awaitMessages({
                                        filter,
                                        max: 1,
                                        time: 1000 * 60,
                                        errors: ["time"]
                                    }).then(async answer => {
                                        let answ = answer.first()
                                        answ.delete().catch(() => {})
                                        if (!answ.mentions?.users.map(x => x).length == 0) return interaction.reply({ content: `Вы не упомянули участников!`, ephemeral: true });
                                        var results = []
                                        answ.mentions.members.forEach((members) => {
                                            if (members.voice.channel) {
                                                if (members.voice.channel.id == channel.id) {
                                                    members.voice.disconnect()
                                                }
                                            }
                                            if (members.id == member.id) return results.push('Вы не можете кикнуть самого себя')
                                            if (!channel.permissionOverwrites.cache.get(members.id))return results.push(`Не удалось найти участника ${members} в правах текущем голосовом канале!`)
                                            channel.permissionOverwrites.delete(members.id)
                                            results.push(`Участник ${members} был кикнут с голосового канала`)
                                        })
                                        await interaction.followUp({ content: `${results.join('\n')}`, ephemeral: true })
                                    }).catch(async (err) => {
                                        console.log(err)
                                        return await interaction.followUp({ content: `Вы не ответили за 1 минуту на счет кикнутых участников с приват канала!`, ephemeral: true })
                                    });
                                });
                            }
                        });
                        break;
                    };
                    case "voice_adduser": {
                        if (!member.voice.channel) return await interaction.reply({ content: `Вы отсутствуете в голосовом канале!`, ephemeral: true })
                        if (member.voice.channel.parentId != JSON.parse(guild[0].private_settings).category_id) return await interaction.reply({ content: `Голосовой канал не соответствует приват комнат!`, ephemeral: true })
                        connection.query(`SELECT * FROM \`discord_privates\` WHERE \`voice_channel\` = '${member.voice.channel.id}'`, async (err, result) => {
                            if (err) {
                                console.log(err)
                                return await interaction.reply({ content: `Произошла критическая системная ошибка!`, ephemeral: true })
                            }
                            if (result.length == 0) return await interaction.reply({ content: `Данный канал не найден в базе данных...`, ephemeral: true });
                            else {
                                if (result[0].text_channel != message.channel.id) return await interaction.reply({ content: `Приват комнатами Вы можете управлять только в канале <#${result[0].text_channel}>`, ephemeral: true });
                                else if (result[0].author != member.id) return await interaction.reply({ content: `Приват комнатами может управлять только создатель приват канала <@${result[0].author}>`, ephemeral: true });
                                else if (member.voice.channel.id != result[0].voice_channel) return await interaction.reply({ content: `Вы находитесь не в приват канале`, ephemeral: true });
                                var channel = member.guild.channels.cache.get(result[0].voice_channel)
                                await interaction.reply({ content: `${member}, упомяните участников, которых хотите выдать доступ к приват комнате! У вас на это минута`, ephemeral: true }).then(async () => {
                                    var filter = response => {
                                        return response?.member?.id == member.id
                                    }
                                    await interaction.channel.awaitMessages({
                                        filter,
                                        max: 1,
                                        time: 1000 * 60,
                                        errors: ["time"]
                                    }).then(async answer => {
                                        var answ = answer.first()
                                        answ.delete().catch(() => {})
                                        if (!answ.mentions?.users.map(x => x).length == 0) return interaction.reply({ content: `Вы не упомянули участника/ов`, ephemeral: true });
                                        var list = []
                                        answ.mentions.members.forEach((member) => {
                                            channel.permissionOverwrites.edit(member.id, {
                                                VIEW_CHANNEL: true,
                                                CONNECT: true,
                                                SPEAK: true,
                                                USE_VAD: true,
                                                STREAM: true,
                                            })
                                            list.push(member)
                                        })
                                        return await interaction.followUp({ content: `Вы успешно занесли участников ${list.map(m => `<@${m.id}>`).join(', ')} в приват канал!`, ephemeral: true })
                                    }).catch(async (err) => {
                                        console.log(err)
                                        return await interaction.followUp({ content: `Вы не ответили за 1 минуту на счет добавление участников в приват канал!`, ephemeral: true })
                                    });
                                }).catch(() => {})
                            }
                        });
                        break;
                    };
                    case "voice_limit": {
                        if (!member.voice.channel) return await interaction.reply({ content: `Вы отсутствуете в голосовом канале!`, ephemeral: true })
                        if (member.voice.channel.parentId != JSON.parse(guild[0].private_settings).category_id) return await interaction.reply({ content: `Голосовой канал не соответствует приват комнат!`, ephemeral: true })
                        connection.query(`SELECT * FROM \`discord_privates\` WHERE \`voice_channel\` = '${member.voice.channel.id}'`, async (err, result) => {
                            if (err) {
                                console.log(err)
                                return await interaction.reply({ content: `Произошла критическая системная ошибка!`, ephemeral: true })
                            }
                            if (result.length == 0) return await interaction.reply({ content: `Данный канал не найден в базе данных...`, ephemeral: true });
                            else {
                                if (result[0].text_channel != message.channel.id) return await interaction.reply({ content: `Приват комнатами Вы можете управлять только в канале <#${result[0].text_channel}>`, ephemeral: true });
                                else if (result[0].author != member.id) return await interaction.reply({ content: `Приват комнатами может управлять только создатель приват канала <@${result[0].author}>`, ephemeral: true });
                                else if (member.voice.channel.id != result[0].voice_channel) return await interaction.reply({ content: `Вы находитесь не в приват канале`, ephemeral: true });
                                var channel = member.guild.channels.cache.get(result[0].voice_channel)
                                await interaction.reply({ content: `${member}, укажите новый лимит для приват комнат, у вас на это есть минута!`, ephemeral: true }).then(async () => {
                                    const filter = response => {
                                        return response?.member?.id == member.id
                                    }
                                    await interaction.channel.awaitMessages({
                                        filter,
                                        max: 1,
                                        time: 1000 * 60,
                                        errors: ["time"]
                                    }).then(async answer => {
                                        var limit = answer.first()
                                        limit.delete().catch(() => {})
                                        if (isAN(limit.content))return await interaction.followUp({ content: `Параметр может быть только числом!`, ephemeral: true });
                                        if (limit.content > 99 || limit.content < 2) return await interaction.followUp({ content: `Пользователей не может быть больше чем 99 и меньше чем 2`, ephemeral: true });
                                        await channel.setUserLimit(`${limit.content}`)
                                        return await interaction.followUp({ content: `Вы успешно сменили лимит участников в приват канале!`, ephemeral: true })
                                    }).catch(async (err) => {
                                        console.log(err)
                                        return await interaction.followUp({ content: `Вы не ответили за 1 минуту на счет лимита в приват канале!`, ephemeral: true })
                                    });
                                }).catch(() => {});
                            }
                        });
                        break;
                    };
                    case "voice_name": {
                        if (!member.voice.channel) return await interaction.reply({ content: `Вы отсутствуете в голосовом канале!`, ephemeral: true })
                        if (member.voice.channel.parentId != JSON.parse(guild[0].private_settings).category_id) return await interaction.reply({ content: `Голосовой канал не соответствует приват комнат!`, ephemeral: true })
                        connection.query(`SELECT * FROM \`discord_privates\` WHERE \`voice_channel\` = '${member.voice.channel.id}'`, async (err, result) => {
                            if (err) {
                                console.log(err)
                                return await interaction.reply({ content: `Произошла критическая системная ошибка!`, ephemeral: true })
                            }
                            if (result.length == 0) return await interaction.reply({ content: `Данный канал не найден в базе данных...`, ephemeral: true });
                            else {
                                if (result[0].text_channel != message.channel.id) return await interaction.reply({ content: `Приват комнатами Вы можете управлять только в канале <#${result[0].text_channel}>`, ephemeral: true });
                                else if (result[0].author != member.id) return await interaction.reply({ content: `Приват комнатами может управлять только создатель приват канала <@${result[0].author}>`, ephemeral: true });
                                else if (member.voice.channel.id != result[0].voice_channel) return await interaction.reply({ content: `Вы находитесь не в приват канале`, ephemeral: true });
                                var channel = member.guild.channels.cache.get(result[0].voice_channel)
                                await interaction.reply({ content: `${member}, укажите новое название для приват комнат, у вас на это есть минута!`, ephemeral: true }).then(async () => {
                                    const filter = response => {
                                        return response?.member?.id == member.id
                                    }
                                    await interaction.channel.awaitMessages({
                                        filter,
                                        max: 1,
                                        time: 1000 * 60,
                                        errors: ["time"]
                                    }).then(async answer => {
                                        var name = answer.first()
                                        name.delete().catch(() => {})
                                        if (name.length >= 32)return await interaction.reply({ content: `${member}, Вы указали более 32 символов для изменения названия приват канала`, ephemeral: true })
                                        channel.setName(name.content).catch(async (err) => { 
                                            console.log(err) 
                                            return await interaction.followUp({ content: `Произошла ошибка..`, ephemeral: true })
                                        })
                                        return await interaction.followUp({ content: `Вы успешно сменили название приват канала!`, ephemeral: true })
                                    }).catch(async (err) => {
                                        console.log(err)
                                        return await interaction.reply({ content: `Вы не ответили за 1 минуту на счет названия приват канала!`, ephemeral: true })
                                    });
                                }).catch(() => {});
                            }
                        })
                        break;
                    };
                    case "voice_lock": {
                        if (!member.voice.channel) {
                            return await interaction.reply({ content: `Вы отсутствуете в голосовом канале!`, ephemeral: true })
                        }
                        if (member.voice.channel.parentId != JSON.parse(guild[0].private_settings).category_id) {
                            return await interaction.reply({ content: `Голосовой канал не соответствует приват комнат!`, ephemeral: true })
                        }
                        connection.query(`SELECT * FROM \`discord_privates\` WHERE \`voice_channel\` = '${member.voice.channel.id}'`, async (err, result) => {
                            if (err) {
                                console.log(err)
                                return await interaction.reply({ content: `Произошла ошибка базы данных!`, ephemeral: true })
                            }
                            if (result.length == 0)  return await interaction.reply({ content: `Данный канал не найден в базе данных приватных каналов!`, ephemeral: true });
                            else {
                                if (result[0].text_channel != message.channel.id)  return await interaction.reply({ content: `Приват комнатами Вы можете управлять только в канале <#${result[0].voice_channel}>`, ephemeral: true });
                                else if (result[0].author != member.id)  return await interaction.reply({ content: `Приват комнатами может управлять только создатель приват канала <@${result[0].author}>`, ephemeral: true });
                                else if (member.voice.channel.id != result[0].voice_channel) return await interaction.reply({ content: `Вы находитесь не в приват канале`, ephemeral: true })
                                var channel = member.guild.channels.cache.get(result[0].voice_channel)
                                if (channel.permissionOverwrites.cache.get(member.guild.id).allow.serialize()['CONNECT'] == false) {
                                    channel.permissionOverwrites.edit(member.guild.id, {
                                        VIEW_CHANNEL: true,
                                        CONNECT: true,
                                        SPEAK: true,
                                        USE_VAD: true,
                                        STREAM: true,
                                    })
                                    return interaction.reply({ content: `Доступ к каналу открыт`, ephemeral: true })
                                } else if (channel.permissionOverwrites.cache.get(member.guild.id).allow.serialize()['CONNECT'] == true) {
                                    channel.permissionOverwrites.edit(member.guild.id, {
                                        VIEW_CHANNEL: false,
                                        CONNECT: false,
                                        SPEAK: false,
                                        USE_VAD: false,
                                        STREAM: false,
                                    })
                                    return interaction.reply({ content: `Доступ к каналу закрыт`, ephemeral: true })
                                }
                            }
                        })
                        break;
                    };
                    default: break;
                };
            });
        });
    };

    roles9_list = async (bot, interaction) => {
        if (!["role9g_plus", "role9r_plus", "role9_wait", "role9_minus", "role9_delete"].some(id => id == interaction.values)) return;
        var { member, message } = interaction;
        await connection.query(`SELECT * FROM \`discord_settings\` WHERE \`guild\` = '${member.guild.id}'`, async (error, guild) => {
            if (error) {
                console.log(error)
                return await interaction.reply({ content: `${member}, Произошла критическая системная ошибка!`, ephemeral: true })
            }
            if (guild.length === 0) return;
            if (guild[0].deputy_module == 0) return;
            switch(interaction.values[0]) {
                case "role9g_plus": {
                    var gguild = bot.guilds.cache.get(member.guild.id);
                    var user = gguild.members.cache.get(message.embeds[0].fields[2].value.replace(/[^a-zа-яё0-9\s]/gi, ''));
                    if (!user) return await interaction.reply({ content: `${member}, пользователь не найден...`, ephemeral: true })
                    var roleid = message.embeds[0].fields[0].value.replace(/[^a-zа-яё0-9\s]/gi, '');
                    if (message.channel.id == JSON.parse(guild[0].deputy_settings).ghetto_channel) {
                        if (!member.roles.cache.some(r => (JSON.parse(guild[0].deputy_settings).senators_ghetto).includes(r.id)))
                            return await interaction.reply({ content: `${member}, недостаточно прав!`, ephemeral: true });
                    } else if (message.channel.id == JSON.parse(guild[0].deputy_settings).mafia_channel) {
                        if (!member.roles.cache.some(r => (JSON.parse(guild[0].deputy_settings).senators_mafia).includes(r.id)))
                            return await interaction.reply({ content: `${member}, недостаточно прав!`, ephemeral: true });
                    } else return;
                    var role = member.guild.roles.cache.get(roleid);
                    if (!role) return await interaction.reply({ content: `${member}, не найдена роль для выдачи!`, ephemeral: true })
                    var logs = member.guild.channels.cache.find(c => c.id == JSON.parse(guild[0].deputy_settings).logs);
                    user.roles.add(role).then(() => {
                        if (JSON.parse(guild[0].deputy_settings).additional_roles[roleid]) {
                            user.roles.add(gguild.roles.cache.get(JSON.parse(guild[0].deputy_settings).additional_roles[roleid]))
                            .catch(() => {})
                        }
                        if (logs) logs.send({
                            content: `>>> **Пользователь:** <@${member.id}>\n\`\`\`diff\n+ Выдал роль "${role.name}"\`\`\`**Запросил:** ${user}\n**————————————**`
                        });
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
                                title: "[Одобрено]: " + message.embeds[0].title,
                                fields: [
                                    message.embeds[0].fields
                                ],
                                timestamp: new Date(),
                            }],
                            components: []
                        })
                    })
                    .catch(async (e) => {
                        await interaction.reply({ content: `Ошибка, я не смог выдать роли игроку..`, ephemeral: true })
                    })
                    break;
                };
                case "role9r_plus": {
                    var gguild = bot.guilds.cache.get(member.guild.id);
                    var user = gguild.members.cache.get(message.embeds[0].fields[2].value.replace(/[^a-zа-яё0-9\s]/gi, ''));
                    if (!user) return await interaction.reply({ content: `${member}, пользователь не найден...`, ephemeral: true })
                    var roleid = message.embeds[0].fields[0].value.replace(/[^a-zа-яё0-9\s]/gi, '');
                    if (message.channel.id == JSON.parse(guild[0].deputy_settings).ghetto_channel) {
                        if (!member.roles.cache.some(r => (JSON.parse(guild[0].deputy_settings).senators_ghetto).includes(r.id)))
                            return await interaction.reply({ content: `${member}, недостаточно прав!`, ephemeral: true });
                    } else if (message.channel.id == JSON.parse(guild[0].deputy_settings).mafia_channel) {
                        if (!member.roles.cache.some(r => (JSON.parse(guild[0].deputy_settings).senators_mafia).includes(r.id)))
                            return await interaction.reply({ content: `${member}, недостаточно прав!`, ephemeral: true });
                    } else return;
                    var role = member.guild.roles.cache.get(roleid);
                    if (!role) return await interaction.reply({ content: `${member}, не найдена роль для выдачи!`, ephemeral: true })
                    var logs = member.guild.channels.cache.find(c => c.id == JSON.parse(guild[0].deputy_settings).logs);
                    user.roles.remove(role).then(() => {
                        if (JSON.parse(guild[0].deputy_settings).additional_roles[roleid]) {
                            user.roles.remove(gguild.roles.cache.get(JSON.parse(guild[0].deputy_settings).additional_roles[roleid]))
                            .catch(() => {})
                        }
                        if (logs) logs.send({
                            content: `>>> **Пользователь:** <@${member.id}>\n\`\`\`diff\n- Снял роль "${role.name}"\`\`\`**Запросил:** ${user}\n**————————————**`
                        });
                        user.send({
                            embeds: [{
                                color: 0x43b581,
                                title: `Ответ на запрос на снятие роли`,
                                description: `**Вам была снята роль "${role.name}"**`,
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
                                title: "[Одобрено]: " + message.embeds[0].title,
                                fields: [
                                    message.embeds[0].fields
                                ],
                                timestamp: new Date(),
                            }],
                            components: []
                        })
                    })
                    .catch(async () => {
                        await interaction.reply({ content: `Ошибка, я не смог снять роли игроку..`, ephemeral: true })
                    })
                    break;
                };
                case "role9_wait": {
                    if (message.channel.id == JSON.parse(guild[0].deputy_settings).ghetto_channel) {
                        if (!member.roles.cache.some(r => (JSON.parse(guild[0].deputy_settings).senators_ghetto).includes(r.id)))
                            return await interaction.reply({ content: `${member}, недостаточно прав!`, ephemeral: true });
                    } else if (message.channel.id == JSON.parse(guild[0].deputy_settings).mafia_channel) {
                        if (!member.roles.cache.some(r => (JSON.parse(guild[0].deputy_settings).senators_mafia).includes(r.id)))
                            return await interaction.reply({ content: `${member}, недостаточно прав!`, ephemeral: true });
                    } else return;
                    var row = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('select')
                            .setPlaceholder('Выберите дейтсвие')
                            .addOptions([
                                {
                                    label: '✅',
                                    description: 'Выдать роль игроку',
                                    value: 'role9g_plus',
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
                    message.edit({
                        content: `${member} перевел запрос в режим ожидания..`,
                        embeds: [{
                            color: 0xf9a62b,
                            title: "[В ожидании]" + message.embeds[0].title,
                            fields: [
                                message.embeds[0].fields
                            ],
                            timestamp: new Date(),
                        }],
                        components: [row],
                    })
                    .then(async () => {
                        await interaction.reply({ content: `${member}, вы успешно перевели запрос в статус ожидания..`, ephemeral: true }).catch(() => {});
                    }).catch(() => {});
                    break;
                };
                case "role9_minus": {
                    if (message.channel.id == JSON.parse(guild[0].deputy_settings).ghetto_channel) {
                        if (!member.roles.cache.some(r => (JSON.parse(guild[0].deputy_settings).senators_ghetto).includes(r.id)))
                            return await interaction.reply({ content: `${member}, недостаточно прав!`, ephemeral: true });
                    } else if (message.channel.id == JSON.parse(guild[0].deputy_settings).mafia_channel) {
                        if (!member.roles.cache.some(r => (JSON.parse(guild[0].deputy_settings).senators_mafia).includes(r.id)))
                            return await interaction.reply({ content: `${member}, недостаточно прав!`, ephemeral: true });
                    } else return;
                    var gguild = bot.guilds.cache.get(member.guild.id);
                    var user = gguild.members.cache.get(message.embeds[0].fields[2].value.replace(/[^a-zа-яё0-9\s]/gi, ''));
                    if (!user) return await interaction.reply({ content: `${member}, пользователь не найден...`, ephemeral: true })
                    await interaction.reply({ content: `${member}, укажите причину отказа в новом сообщении..`, ephemeral: true }).then(async () => {
                        var filter = response => { return response?.member?.id == member.id };
                        await interaction.channel.awaitMessages({ filter, max: 1, time: 1000 * 60, errors: ["time"] }).then(async answer => {
                            var answ = answer.first();
                            answ.delete().catch(() => {})
                            user.send({
                                embeds: [{
                                    color: 0xf04747,
                                    title: `Ответ на ваш запрос на выдачу роли`,
                                    description: `**Ваш запрос на выдачу роли 9  был отклонен ${member} по причине:\n\`\`\`${answ.content}\`\`\`**`,
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
                                    title: "[Отклонено]" + message.embeds[0].title,
                                    fields: [
                                        message.embeds[0].fields
                                    ],
                                    timestamp: new Date(),
                                }],
                                components: [],
                            })
                            .then(async () => {
                                await interaction.followUp({ content: `${member}, Вы успешно отклонили запрос пользователя ${user}`, ephemeral: true }).catch(() => {});
                            })
                            .catch(() => {});
                        }).catch(async (err) => {
                            return await interaction.followUp({ content: `${member}, произошла ошибка, но сообщение вроде отправлено..`, ephemeral: true })
                        });
                    });
                    break;
                };
                case "role9_delete": {
                    if (message.channel.id == JSON.parse(guild[0].deputy_settings).ghetto_channel) {
                        if (!member.roles.cache.some(r => (JSON.parse(guild[0].deputy_settings).senators_ghetto).includes(r.id)))
                            return await interaction.reply({ content: `${member}, недостаточно прав!`, ephemeral: true });
                    } else if (message.channel.id == JSON.parse(guild[0].deputy_settings).mafia_channel) {
                        if (!member.roles.cache.some(r => (JSON.parse(guild[0].deputy_settings).senators_mafia).includes(r.id)))
                            return await interaction.reply({ content: `${member}, недостаточно прав!`, ephemeral: true });
                    } else return;
                    message.edit({
                        content: `${member} очистил запрос`,
                        embeds: [{
                            color: 0x36393F,
                            title: "[Очищено]" + message.embeds[0].title,
                            fields: [
                                message.embeds[0].fields
                            ],
                            timestamp: new Date(),
                        }],
                        components: []
                    }).then(async () => {
                        await interaction.reply({ content: `${member}, Вы успешно очистили запрос!`, ephemeral: true })
                    })
                    break;
                };
                default: break;
            }
        });
    };
};

function form(cnt, channel) {
    if (channel == '893012932860993583') {
        var lowerCaseContent = cnt.toLowerCase();
        var true_form = ['имя фамилия(лидера)', 'какой мафии вы лидер', 'discord'];
        return true_form.every(i => lowerCaseContent.includes(i));
    } else if (channel == '683381028626104533') {
        var lowerCaseContent = cnt.toLowerCase();
        var true_form = ['ваша мафия', 'ник кандидата', 'форумник'];
        return true_form.every(i => lowerCaseContent.includes(i));
    } else if (channel == '864458716999974924') {
        var lowerCaseContent = cnt.toLowerCase();
        var true_form = ['ваша мафия', 'ник кандидата', 'форумник'];
        return true_form.every(i => lowerCaseContent.includes(i));
    }
    else if (channel == '926474491704520742') {
        var lowerCaseContent = cnt.toLowerCase();
        var true_form = ['ник лидера мафии', 'ник лидера мафии', 'поставил/снял зама', 'ник кандидата'];
        return true_form.every(i => lowerCaseContent.includes(i));
    }
}

module.exports = new CaptureSystems();