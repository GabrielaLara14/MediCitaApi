// Validaciones de reseñas.
const Joi = require('joi');
const { FIELD_LENGTH, MAX_TAGS_PER_REVIEW, MAX_WAIT_MINUTES, RATING_RANGE } = require('../env/constants');
const { buildCreateSchema, buildPartialSchema, idSchema } = require('./common');

const reviewFields = {
  // Calificación entera dentro del rango permitido (1 a 5).
  rating: Joi.number().integer().min(RATING_RANGE.MIN).max(RATING_RANGE.MAX),
  comment: Joi.string().trim().allow('').max(FIELD_LENGTH.COMMENT),
  // Minutos de espera: entero entre 0 y un día.
  waitMinutes: Joi.number().integer().min(0).max(MAX_WAIT_MINUTES),
  // Etiquetas: lista de textos cortos, sin repetidos y con un máximo de elementos.
  tags: Joi.array().items(Joi.string().trim().min(1).max(FIELD_LENGTH.TAG)).max(MAX_TAGS_PER_REVIEW).unique(),
};

// Filtros opcionales del listado.
const listQuery = Joi.object({
  doctorId: idSchema,
  appointmentId: idSchema,
});

module.exports = {
  list: listQuery,
  // Al crear son obligatorios la cita y la calificación; el resto es opcional.
  create: buildCreateSchema({ appointmentId: idSchema, ...reviewFields }, ['appointmentId', 'rating']),
  // Al actualizar no se puede cambiar la cita asociada.
  update: buildPartialSchema(reviewFields),
};
