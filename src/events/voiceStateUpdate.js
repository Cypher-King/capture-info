'use strict';

var { MessageActionRow, MessageButton } = require('discord.js'),
    { connection } = require('../handlers/connection');

module.exports = async (bot, oldMember, newMember) => { 
    // if (newMember.channelId === oldMember.channelId) return;
    // var server = bot.guilds.cache.get(oldMember.guild.id);
    // var member_oldchannel = newMember.guild.channels.cache.get(oldMember.channelId)
    // var member_newchannel = newMember.guild.channels.cache.get(newMember.channelId);
    // var member = server.members.cache.get(oldMember.id);
    // if (member_newchannel) {
    //     connection.query(`SELECT * FROM \`discord_settings\` WHERE \`guild\` = '${server.id}'`, async (error, result) => {
    //         if (error || result.length == 0 || result[0].private_enable == 0) return;
    //         if (member_newchannel.id == JSON.parse(result[0].private_settings).channel_id) {
    //             var category = server.channels.cache.get(JSON.parse(result[0].private_settings).category_id);
    //             if (!category) return;
    //             if (member.voice.channel.id != JSON.parse(result[0].private_settings).channel_id) return;
    //             server.channels.create(`👻・${member.user.username}`, { 
    //                 type: 'GUILD_VOICE',
    //                 parent: category,
    //                 permissionOverwrites: [
    //                     { id: member.id, allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'USE_VAD'], deny: ['ADMINISTRATOR'] }, 
    //                     { id: server.id, allow: ['CONNECT', 'SPEAK', 'USE_VAD'], deny: ['ADMINISTRATOR', 'VIEW_CHANNEL'] } 
    //                 ],  
    //                 reason: `Создан канал для приватных комнат | ${member.user.username}`
    //             })
    //             .then((private_channel) => {
    //                 private_channel.setUserLimit('2')
    //                 member.voice.setChannel(private_channel.id)
    //                 .catch(() => { private_channel.delete(); });
    //             })
    //         }
    //     })
    // }

    // if (member_oldchannel) {
    //     connection.query(`SELECT * FROM \`discord_settings\` WHERE \`guild\` = '${server.id}'`, async (error, result) => {
    //         if (error || result.length == 0 || result[0].private_enable == 0) return;
    //         if (member_oldchannel.name.startsWith("👻・")) {
    //             if (member_oldchannel.members.size != 0) return;
    //             return member_oldchannel.delete();
    //         }
    //     })
    // }

    if (newMember.channelId == oldMember.channelId) return;
    if (!oldMember.guild || !newMember.guild) return;
    var server = bot.guilds.cache.get(oldMember.guild.id);
    var member_oldchannel = newMember.guild.channels.cache.get(oldMember.channelId)
    var member_newchannel = newMember.guild.channels.cache.get(newMember.channelId);
    var member = server.members.cache.get(oldMember.id);

    connection.query(`SELECT * FROM \`discord_settings\` WHERE \`guild\` = '${server.id}'`, async (error, guild) => {
        if (error || guild.length == 0 || guild[0].private_enable == 0) { if (error) return console.log(error); else return; }
        if (member_newchannel) {
            var category = server.channels.cache.get(JSON.parse(guild[0].private_settings).category_id);
            if (!category) {
                member.send({
                    embeds: [{
                        color: 0xE53935,
                        title: '📛 | Системная ошибка',
                        description: `**${member}, критическая ошибка!\nПередайте модерации что я не могу найти категорию...**`
                    }]
                })
            }
            if (member_newchannel.id != JSON.parse(guild[0].private_settings).channel_id) return;
            if (Date.now() - member.joinedAt < 10 * 60 * 1000) {
                member.send({
                    embeds: [{
                        color: 0xebc7ff,
                        title: 'ℹ️ | Информация',
                        description: `**${member}, к сожалению, не могу сейчас создать вам приват по причине безопасности..\nПодождите буквально 10 минут!**`
                    }]
                })
                return oldMember.disconnect();
            }
            server.channels.create(`👻・${member.user.username}`, { 
                type: 'GUILD_VOICE',
                parent: category,
                permissionOverwrites: [
                    { id: member.id, allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'USE_VAD'], deny: ['ADMINISTRATOR'] }, 
                    { id: server.id, allow: ['CONNECT', 'SPEAK', 'USE_VAD'], deny: ['ADMINISTRATOR', 'VIEW_CHANNEL'] } 
                ],  
                reason: `Создан канал для приватных комнат | ${member.user.username}`
            })
            .then(async (voice_channel) => {
                voice_channel.setUserLimit('2')
                member.voice.setChannel(voice_channel.id)
                .catch(() => {  return voice_channel.delete();  });
                await oldMember.guild.channels.create(`${member.user.username}`, {
                    type: 'GUILD_TEXT',
                    permissionOverwrites: [{
                        id: member.id,
                        allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'USE_VAD', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'STREAM'],
                        deny: ['ADMINISTRATOR', `CREATE_INSTANT_INVITE`, `MANAGE_ROLES`, `MANAGE_WEBHOOKS`, `MOVE_MEMBERS`, `PRIORITY_SPEAKER`, 'MANAGE_CHANNELS',]
                    },
                    {
                        id: newMember.guild.id,
                        deny: ['ADMINISTRATOR', `CREATE_INSTANT_INVITE`, `MANAGE_ROLES`, `MANAGE_WEBHOOKS`, 'DEAFEN_MEMBERS', `MOVE_MEMBERS`, `PRIORITY_SPEAKER`, `MANAGE_CHANNELS`, 'MUTE_MEMBERS', 'MOVE_MEMBERS', 'SPEAK', 'USE_VAD', 'CONNECT', 'VIEW_CHANNEL', 'STREAM']
                    }], 
                    parent: category, 
                    reason: `Создан для управления приватами | ${member.user.username}`
                }).then(async (text_channel) => {
                    await connection.query(`INSERT INTO \`discord_privates\` (\`guild\`, \`author\`, \`voice_channel\`, \`text_channel\`) VALUES ('${oldMember.guild.id}', '${member.id}', '${voice_channel.id}', '${text_channel.id}');`, async (err) => {
                        if (err) {
                            console.log(err)
                            member.send({
                                embeds: [{
                                    color: 0xE53935,
                                    title: '📛 | Системная ошибка',
                                    description: `**${member}, критическая ошибка!\nПередайте модерации...**`
                                }]
                            })
                            text_channel.delete()
                            .catch(() => {})
                            voice_channel.delete()
                            .catch(() => {})
                            return;
                        }
                        const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('voice_name')
                                .setStyle('SECONDARY')
                                .setEmoji(`🔧`)
                                .setLabel(`Название`),
                            new MessageButton()
                                .setCustomId('voice_lock')
                                .setStyle('SECONDARY')
                                .setEmoji(`🔒`)
                                .setLabel(`Открыть/Закрыть`),
                            new MessageButton()
                                .setCustomId('voice_limit')
                                .setStyle('SECONDARY')
                                .setEmoji(`🛠️`)
                                .setLabel(`Лимит`),
                        )
                        var row1 = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('voice_adduser')
                                .setStyle('SUCCESS')
                                .setEmoji(`➕`)
                                .setLabel(`Добавить`),
                            new MessageButton()
                                .setCustomId('voice_kick')
                                .setStyle('DANGER')
                                .setEmoji(`➖`)
                                .setLabel(`Исключить`),
                            new MessageButton()
                                .setCustomId('voice_delete')
                                .setStyle('DANGER')
                                .setEmoji(`🗑️`)
                                .setLabel(`Удалить`),
                        )

                        text_channel.send({
                            content: `${member}`,
                            embeds: [{
                                color: "RANDOM",
                                description: `Измените настройки для вашего приватного голосового канала`
                            }],
                            components: [row, row1]
                        })
                    })

                })            
            }).catch(() => { return; })
        }  
        if (member_oldchannel) {
            connection.query(`SELECT * FROM \`discord_privates\` WHERE \`guild\` = '${oldMember.guild.id}' AND \`voice_channel\` = '${member_oldchannel.id}'`, async (error, result) => {
                if (error) return console.log(error);
                if (result.length != 0) {
                    var privates = await newMember.guild.channels.cache.get(result[0].voice_channel)
                    var channels = await newMember.guild.channels.cache.get(result[0].text_channel)
                    if (member_oldchannel.id == privates.id) {
                        if (privates.members.size == 0) {
                            connection.query(`DELETE FROM \`discord_privates\` WHERE \`voice_channel\` = '${result[0].voice_channel}'`, async (err) => {
                                if (err) console.log(err);
                                if (privates) privates.delete().catch((e) => { console.log(e) });
                                if (channels) channels.delete().catch((e) => { console.log(e) });
                            })
                        }
                    }
                }
            })
        }
    });
};