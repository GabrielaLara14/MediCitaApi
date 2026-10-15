// Opciones de conexión a MySQL tomadas de la configuración validada.
const { env } = require('./config');

module.exports = {
  host: env.database.host,
  port: env.database.port,
  user: env.database.user,
  password: env.database.password,
  database: env.database.name,
  // Número máximo de conexiones simultáneas del pool.
  connectionLimit: env.database.connectionLimit,
  // Guarda y lee las fechas en UTC para evitar desajustes por zona horaria.
  timezone: 'Z',
  // Devuelve los DECIMAL como números en lugar de textos.
  decimalNumbers: true,
};
