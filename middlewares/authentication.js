// Middlewares de autenticación (¿quién eres?) y autorización (¿qué puedes hacer?).
const { HTTP_STATUS, ROLES } = require('../env/constants');
const HttpError = require('../errors/HttpError');
const { verifyToken } = require('../utils/token');

const BEARER_PREFIX = 'Bearer ';

// Exige el encabezado "Authorization: Bearer <token>" y guarda el usuario en request.user.
function authenticate(request, _response, next) {
  const authorization = request.headers.authorization ?? '';
  // Sin el prefijo Bearer no hay token: responde 401.
  if (!authorization.startsWith(BEARER_PREFIX)) {
    throw new HttpError(HTTP_STATUS.UNAUTHORIZED, 'Token de autenticacion requerido');
  }

  try {
    // Quita el prefijo y valida el token; si es falso o venció, entra al catch.
    request.user = verifyToken(authorization.slice(BEARER_PREFIX.length));
  } catch {
    throw new HttpError(HTTP_STATUS.UNAUTHORIZED, 'Token invalido o expirado');
  }
  next();
}

// Permite continuar solo si el usuario autenticado tiene el rol indicado; si no, 403.
function requireRole(role) {
  return (request, _response, next) => {
    if (request.user.role !== role) {
      throw new HttpError(HTTP_STATUS.FORBIDDEN, 'No tienes permisos para esta operacion');
    }
    next();
  };
}

// Permite continuar al administrador o al paciente cuyo id coincide con el de la ruta.
function requireSelfOrAdmin(request, _response, next) {
  const { id, role } = request.user;
  const isOwner = role === ROLES.PATIENT && id === Number(request.params.id);
  if (role !== ROLES.ADMIN && !isOwner) {
    throw new HttpError(HTTP_STATUS.FORBIDDEN, 'No tienes permisos para esta operacion');
  }
  next();
}

module.exports = { authenticate, requireRole, requireSelfOrAdmin };
