const { HTTP_STATUS, ROLES } = require('../env/constants');
const HttpError = require('../errors/HttpError');
const { verifyToken } = require('../utils/token');

const BEARER_PREFIX = 'Bearer ';

function authenticate(request, _response, next) {
  const authorization = request.headers.authorization ?? '';
  if (!authorization.startsWith(BEARER_PREFIX)) {
    throw new HttpError(HTTP_STATUS.UNAUTHORIZED, 'Token de autenticacion requerido');
  }

  try {
    request.user = verifyToken(authorization.slice(BEARER_PREFIX.length));
  } catch {
    throw new HttpError(HTTP_STATUS.UNAUTHORIZED, 'Token invalido o expirado');
  }
  next();
}

function requireRole(role) {
  return (request, _response, next) => {
    if (request.user.role !== role) {
      throw new HttpError(HTTP_STATUS.FORBIDDEN, 'No tienes permisos para esta operacion');
    }
    next();
  };
}

function requireSelfOrAdmin(request, _response, next) {
  const { id, role } = request.user;
  const isOwner = role === ROLES.PATIENT && id === Number(request.params.id);
  if (role !== ROLES.ADMIN && !isOwner) {
    throw new HttpError(HTTP_STATUS.FORBIDDEN, 'No tienes permisos para esta operacion');
  }
  next();
}

module.exports = { authenticate, requireRole, requireSelfOrAdmin };
