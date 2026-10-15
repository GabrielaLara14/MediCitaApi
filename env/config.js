// Carga y valida las variables de entorno del archivo .env y las expone ya convertidas.
require('dotenv/config');

// Variables que el archivo .env debe traer obligatoriamente.
const REQUIRED_VARIABLES = [
  'PORT',
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'DB_CONNECTION_LIMIT',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'BCRYPT_ROUNDS',
  'CATALOG_CACHE_SECONDS',
];

// Detecta cuáles de las variables obligatorias no están definidas.
const missingVariables = REQUIRED_VARIABLES.filter((name) => process.env[name] === undefined);

// Detiene el arranque con un mensaje claro si falta alguna.
if (missingVariables.length > 0) {
  throw new Error(`Faltan variables de entorno: ${missingVariables.join(', ')}`);
}

// Configuración agrupada; los valores numéricos se convierten porque .env siempre entrega texto.
const env = {
  port: Number(process.env.PORT),
  // Datos de conexión a MySQL.
  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT),
  },
  // Clave secreta y duración de los tokens de sesión (JWT).
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  // Costo del cifrado de contraseñas: más rondas es más seguro pero más lento.
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS),
  // Segundos que el navegador puede guardar en caché los catálogos (médicos).
  catalogCacheSeconds: Number(process.env.CATALOG_CACHE_SECONDS),
};

module.exports = { env };
