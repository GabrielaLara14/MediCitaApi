require('dotenv/config');

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

const missingVariables = REQUIRED_VARIABLES.filter((name) => process.env[name] === undefined);

if (missingVariables.length > 0) {
  throw new Error(`Faltan variables de entorno: ${missingVariables.join(', ')}`);
}

const env = {
  port: Number(process.env.PORT),
  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT),
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS),
  catalogCacheSeconds: Number(process.env.CATALOG_CACHE_SECONDS),
};

module.exports = { env };
