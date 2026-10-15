const { HTTP_STATUS } = require('../env/constants');
const { env } = require('../env/config');
const HttpError = require('../errors/HttpError');
const { verifyPassword } = require('../utils/password');
const { signToken } = require('../utils/token');

class SessionService {
  constructor(accountDaosByRole) {
    this.accountDaosByRole = accountDaosByRole;
  }

  async create({ email, password, role }) {
    const credentials = await this.accountDaosByRole[role].findCredentialsByEmail(email);
    const isValid = credentials && (await verifyPassword(password, credentials.passwordHash));
    if (!isValid) {
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
