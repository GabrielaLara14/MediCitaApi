// Validaciones de citas (se usa la librería Joi).
const Joi = require('joi');
const { APPOINTMENT_STATUS } = require('../env/constants');
const { buildCreateSchema, buildPartialSchema, dateOnlySchema, idSchema } = require('./common');

// Fecha y hora en formato ISO que debe ser posterior al momento actual (no se agenda en el pasado).
const futureDateSchema = Joi.date().iso().greater('now');

// Filtros opcionales del listado de citas.
const listQuery = Joi.object({
  patientId: idSchema,
  doctorId: idSchema,
  status: Joi.string().valid(...Object.values(APPOINTMENT_STATUS)),
  date: dateOnlySchema,
});

module.exports = {
  list: listQuery,
  // Crear: paciente, médico y fecha son obligatorios.
  create: buildCreateSchema({
    patientId: idSchema,
    doctorId: idSchema,
    scheduledAt: futureDateSchema,
  }),
  // Actualizar: solo se puede cambiar la fecha o el estado, y debe venir al menos uno.
  update: buildPartialSchema({
    scheduledAt: futureDateSchema,
    status: Joi.string().valid(...Object.values(APPOINTMENT_STATUS)),
  }),
};
