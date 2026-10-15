// Cifrado y comprobación de contraseñas con bcrypt (nunca se guardan en texto plano).
const bcrypt = require('bcryptjs');
const { env } = require('../env/config');

// Genera el hash que se almacena en la base de datos.
function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, env.bcryptRounds);
}

// Compara la contraseña escrita con el hash guardado; devuelve true o false.
function verifyPassword(plainPassword, passwordHash) {
  return bcrypt.compare(plainPassword, passwordHash);
}

module.exports = { hashPassword, verifyPassword };
