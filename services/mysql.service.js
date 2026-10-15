// Pool de conexiones a MySQL compartido por toda la aplicación (reutiliza conexiones en vez de abrir una por consulta).
const mysql = require('mysql2/promise');
const config = require('../env/mysqlConfig');

const pool = mysql.createPool(config);

module.exports = pool;
