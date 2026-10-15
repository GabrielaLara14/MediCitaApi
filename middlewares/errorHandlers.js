const { HTTP_STATUS, MYSQL_ERRORS } = require('../env/constants');
const HttpError = require('../errors/HttpError');

const DATABASE_ERROR_MAPPING = {
  [MYSQL_ERRORS.DUPLICATE_ENTRY]: [HTTP_STATUS.CONFLICT, 'Ya existe un registro con esos datos unicos'],
  [MYSQL_ERRORS.MISSING_REFERENCE]: [HTTP_STATUS.BAD_REQUEST, 'Un identificador referenciado no existe'],
  [MYSQL_ERRORS.REFERENCED_ROW]: [HTTP_STATUS.CONFLICT, 'El registro esta referenciado por otros datos'],
};

const MALFORMED_JSON_TYPE = 'entity.parse.failed';

function toHttpError(error) {
  if (error instanceof HttpError) {
    return error;
  }
  if (error.type === MALFORMED_JSON_TYPE) {
    return new HttpError(HTTP_STATUS.BAD_REQUEST, 'El cuerpo de la solicitud no es un JSON valido');
  }
  const databaseMapping = DATABASE_ERROR_MAPPING[error.code];
  if (databaseMapping) {
    return new HttpError(...databaseMapping);
  }
  return null;
}

function notFoundHandler(request, _response, next) {
  next(new HttpError(HTTP_STATUS.NOT_FOUND, `Ruta no encontrada: ${request.method} ${request.originalUrl}`));
}

function errorHandler(error, _request, response, _next) {
  response.removeHeader('Cache-Control');
  const httpError = toHttpError(error);
  if (!httpError) {
    console.error(error);
    response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error interno del servidor',
    });
    return;
  }

  response.status(httpError.statusCode).json({
    status: httpError.statusCode,
    message: httpError.message,
    details: httpError.details,
  });
}

module.exports = { notFoundHandler, errorHandler };
