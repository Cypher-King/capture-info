'use strict';

require('dotenv').config();

var { ShardingManager } = require('discord.js');
require('./src/vk/start.js');

var manager = new ShardingManager('./src/index.js', {  token: process.env.discord_token, totalShards: 2, respawn: true });
manager.on('shardCreate', shard => console.log(`[Клиент]: Запуск шарда #${shard.id}...`));
manager.spawn({ amount: 'auto', delay: 5500, timeout: 30000 })