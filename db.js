const { Client }= require('pg');

const dbClient = new Client({
    host: 'localhost',
    user: 'postgres',
    password: 'omarsultan',
    port: 5432,
    database: 'nodeJS_Practice'
});

module.exports.dbClient = dbClient;