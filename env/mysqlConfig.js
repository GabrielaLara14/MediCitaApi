const { env } = require('./config');

module.exports = {
  host: env.database.host,
  port: env.database.port,
  user: env.database.user,
  password: env.database.password,
  database: env.database.name,
  connectionLimit: env.database.connectionLimit,
  timezone: 'Z',
  decimalNumbers: true,
};
