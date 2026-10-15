// Manejo central de errores: convierte cualquier fallo en una respuesta JSON con el código adecuado.
const { HTTP_STATUS, MYSQL_ERRORS } = require('../env/constants');
const HttpError = require('../errors/HttpError');

// Traducción de errores de MySQL a [código HTTP, mensaje].
const DATABASE_ERROR_MAPPING = {
  [MYSQL_ERRORS.DUPLICATE_ENTRY]: [HTTP_STATUS.CONFLICT, 'Ya existe un registro con esos datos unicos'],
  [MYSQL_ERRORS.MISSING_REFERENCE]: [HTTP_STATUS.BAD_REQUEST, 'Un identificador referenciado no existe'],
  [MYSQL_ERRORS.REFERENCED_ROW]: [HTTP_STATUS.CONFLICT, 'El registro esta referenciado por otros datos'],
};

// Tipo de error que Express genera cuando el JSON recibido está mal escrito.
const MALFORMED_JSON_TYPE = 'entity.parse.failed';

// Devuelve un HttpError si el error es conocido, o null si es un fallo inesperado.
function toHttpError(error) {
  if (error instanceof HttpError) {
    return error;
  }
  if (error.type === MALFORMED_JSON_TYPE) {
    return new HttpError(HTTP_STATUS.BAD_REQUEST, 'El cuerpo de la solicitud no es un JSON valido');
  }
  // Errores de base de datos conocidos (duplicado, referencia inexistente, registro en uso).
  const databaseMapping = DATABASE_ERROR_MAPPING[error.code];
  if (databaseMapping) {
    return new HttpError(...databaseMapping);
  }
  return null;
}

// Se ejecuta cuando ninguna ruta coincidió: responde 404.
function notFoundHandler(request, _response, next) {
  next(new HttpError(HTTP_STATUS.NOT_FOUND, `Ruta no encontrada: ${request.method} ${request.originalUrl}`));
}

// Último eslabón: responde con el error formateado (Express lo reconoce por tener 4 parámetros).
function errorHandler(error, _request, response, _next) {
  // Quita el caché que pudo ponerse antes de fallar, para no guardar una respuesta de error.
  response.removeHeader('Cache-Control');
  const httpError = toHttpError(error);
  // Error inesperado: se registra en consola y se responde 500 sin revelar detalles internos.
  if (!httpError) {
    console.error(error);
    response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error interno del servidor',
    });
    return;
  }

  // Error conocido: responde con su código, mensaje y detalle por campo.
  response.status(httpError.statusCode).json({
    status: httpError.statusCode,
    message: httpError.message,
    details: httpError.details,
  });
}

module.exports = { notFoundHandler, errorHandler };
