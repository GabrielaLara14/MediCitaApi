// Creación y lectura de tokens JWT para mantener la sesión del usuario.
const jwt = require('jsonwebtoken');
const { env } = require('../env/config');

// Crea un token firmado: el id va como "subject" y el rol dentro del contenido.
function signToken({ id, role }) {
  return jwt.sign({ role }, env.jwt.secret, {
    subject: String(id),
    expiresIn: env.jwt.expiresIn,
  });
}

// Valida firma y vencimiento (lanza error si fallan) y devuelve el id y el rol del usuario.
function verifyToken(token) {
  const payload = jwt.verify(token, env.jwt.secret);
  return { id: Number(payload.sub), role: payload.role };
}

module.exports = { signToken, verifyToken };
