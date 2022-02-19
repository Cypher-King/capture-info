'use strict';

var { readdirSync } = require("fs");

module.exports = (bot) => {
    var total = 0;
    console.log(`[Клиент]: Загружаю события...`);
    readdirSync('./src/events/').filter(name => name.endsWith('.js')).forEach(file => {
        var event = require(`../events/${file}`);
        var eventName = file.split('.js')[0];
        bot.on(eventName, event.bind(null, bot));
        total++;
    });
    console.log(`[Клиент]: Загружено ${total} событий`);
};