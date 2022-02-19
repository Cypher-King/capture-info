'use strict';

var { readdirSync } = require("fs");

module.exports = (client) => {
    var _successload = 0;
    var _errorload = 0;
    console.log(`[Клиент]: Загружаю команды...`);
    readdirSync("././src/commands").forEach(dir => {
        var commands = readdirSync(`././src/commands/${dir}/`).filter(file => file.endsWith(".js"));
        for (let file of commands) {
            var pull = require(`../commands/${dir}/${file}`);
            if (pull.name) {
                _successload++;
                client.commands.set(pull.name, pull);
            } else {
                _errorload++
                continue;
            }
            if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        }
    });
    console.log(`[Клиент]: Загружено ${_successload} команд${_errorload == 0 ? `` : `, ${_errorload} - неуспешно`}`);
};