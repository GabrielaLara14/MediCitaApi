const { HTTP_STATUS } = require('../env/constants');
const HttpError = require('../errors/HttpError');
const { idSchema } = require('../validators/common');

function validate(schema, value, message) {
  const { error, value: sanitizedValue } = schema.validate(value, { abortEarly: false });
  if (error) {
    const details = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
    throw new HttpError(HTTP_STATUS.BAD_REQUEST, message, details);
  }
  return sanitizedValue;
}

function validateBody(schema) {
  return (request, _response, next) => {
    request.body = validate(schema, request.body, 'Datos de entrada invalidos');
    next();
  };
}

function validateQuery(schema) {
  return (request, _response, next) => {
    request.filters = validate(schema, request.query, 'Parametros de consulta invalidos');
    next();
  };
}

function validateIdParam(request, _response, next) {
  request.params.id = validate(idSchema.label('id'), request.params.id, 'Identificador invalido');
  next();
}

module.exports = { validateBody, validateQuery, validateIdParam };
