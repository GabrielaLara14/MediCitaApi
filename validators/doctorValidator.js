// Validaciones de médicos.
const Joi = require('joi');
const { FIELD_LENGTH, MAX_MONEY_VALUE } = require('../env/constants');
const { buildCreateSchema, buildPartialSchema, nameSchema } = require('./common');

const doctorFields = {
  name: nameSchema,
  specialty: Joi.string().trim().min(1).max(FIELD_LENGTH.SPECIALTY),
  schedule: Joi.string().trim().min(1).max(FIELD_LENGTH.SCHEDULE),
  // Tarifa: no negativa, con tope y máximo 2 decimales.
  consultationFee: Joi.number().min(0).max(MAX_MONEY_VALUE).precision(2),
  // La biografía puede enviarse vacía.
  biography: Joi.string().trim().allow('').max(FIELD_LENGTH.BIOGRAPHY),
};

// Filtros opcionales del listado: especialidad exacta o texto de búsqueda.
const listQuery = Joi.object({
  specialty: Joi.string().trim().min(1).max(FIELD_LENGTH.SPECIALTY),
  search: Joi.string().trim().min(1).max(FIELD_LENGTH.SEARCH_TERM),
});

module.exports = {
  list: listQuery,
  // Al crear son obligatorios nombre, especialidad, horario y tarifa; la biografía es opcional.
  create: buildCreateSchema(doctorFields, ['name', 'specialty', 'schedule', 'consultationFee']),
  update: buildPartialSchema(doctorFields),
};
