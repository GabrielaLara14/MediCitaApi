// Validación de lo que llega en cada solicitud (cuerpo, parámetros de consulta e id de la ruta).
const { HTTP_STATUS } = require('../env/constants');
const HttpError = require('../errors/HttpError');
const { idSchema } = require('../validators/common');

// Valida un valor con un esquema Joi; si falla lanza 400 con el detalle de cada campo inválido.
function validate(schema, value, message) {
  // abortEarly: false reúne todos los errores en lugar de detenerse en el primero.
  const { error, value: sanitizedValue } = schema.validate(value, { abortEarly: false });
  if (error) {
    const details = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
    throw new HttpError(HTTP_STATUS.BAD_REQUEST, message, details);
  }
  // Devuelve el valor ya limpio (con conversiones y valores por defecto aplicados).
  return sanitizedValue;
}

// Valida y reemplaza el cuerpo JSON.
function validateBody(schema) {
  return (request, _response, next) => {
    request.body = validate(schema, request.body, 'Datos de entrada invalidos');
    next();
  };
}

// Valida los parámetros de la URL (?a=1&b=2) y los deja en request.filters.
function validateQuery(schema) {
  return (request, _response, next) => {
    request.filters = validate(schema, request.query, 'Parametros de consulta invalidos');
    next();
  };
}

// Verifica que el :id de la ruta sea un entero positivo válido.
function validateIdParam(request, _response, next) {
  request.params.id = validate(idSchema.label('id'), request.params.id, 'Identificador invalido');
  next();
}

module.exports = { validateBody, validateQuery, validateIdParam };
