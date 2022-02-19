'use strict';

var mysql = require('mysql');

var connection = mysql.createPool({
	host: process.env.mysql_host,
	user: process.env.mysql_user,
	password: process.env.mysql_password,
	database: process.env.mysql_database_one,
	port : 3306,
	multipleStatements: true,
	insecureAuth : true
});

var vk_connection = mysql.createPool({
	host: process.env.mysql_host,
	user: process.env.mysql_user,
	password: process.env.mysql_password,
	database: process.env.mysql_database_two,
	port : 3306,
	multipleStatements: true,
	insecureAuth : true
});

var tg_connection = mysql.createPool({
	host: process.env.mysql_host,
	user: process.env.mysql_user,
	password: process.env.mysql_password,
	database: "Capture_Telegram",
	port : 3306,
	multipleStatements: true,
	insecureAuth : true
});

var mod_connection = mysql.createPool({
	host: process.env.mysql_host,
	user: process.env.mysql_user,
	password: process.env.mysql_password,
	database: "illegal_moders",
	port : 3306,
	multipleStatements: true,
	insecureAuth : true
});

module.exports = { connection, vk_connection, tg_connection, mod_connection };