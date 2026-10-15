const jwt = require('jsonwebtoken');
const { env } = require('../env/config');

function signToken({ id, role }) {
  return jwt.sign({ role }, env.jwt.secret, {
    subject: String(id),
    expiresIn: env.jwt.expiresIn,
  });
}

function verifyToken(token) {
  const payload = jwt.verify(token, env.jwt.secret);
  return { id: Number(payload.sub), role: payload.role };
}

module.exports = { signToken, verifyToken };
