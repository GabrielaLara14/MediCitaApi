// Inicio de sesión: verifica las credenciales y entrega un token JWT.
const { HTTP_STATUS } = require('../env/constants');
const { env } = require('../env/config');
const HttpError = require('../errors/HttpError');
const { verifyPassword } = require('../utils/password');
const { signToken } = require('../utils/token');

class SessionService {
  // Recibe un DAO por rol (admin o patient) para buscar al usuario en la tabla correcta.
  constructor(accountDaosByRole) {
    this.accountDaosByRole = accountDaosByRole;
  }

  async create({ email, password, role }) {
    const credentials = await this.accountDaosByRole[role].findCredentialsByEmail(email);
    // Válido solo si el correo existe y la contraseña coincide con el hash guardado.
    const isValid = credentials && (await verifyPassword(password, credentials.passwordHash));
    if (!isValid) {
      // Mensaje único para correo o contraseña incorrectos: no revela cuál de los dos falló.
      throw new HttpError(HTTP_STATUS.UNAUTHORIZED, 'Correo o contraseña incorrectos');
    }

    return {
      token: signToken({ id: credentials.id, role }),
      tokenType: 'Bearer',
      expiresIn: env.jwt.expiresIn,
      userId: credentials.id,
      role,
    };
  }
}

module.exports = SessionService;
