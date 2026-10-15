const Joi = require('joi');
const { APPOINTMENT_STATUS } = require('../env/constants');
const { buildCreateSchema, buildPartialSchema, dateOnlySchema, idSchema } = require('./common');

const futureDateSchema = Joi.date().iso().greater('now');

const listQuery = Joi.object({
  patientId: idSchema,
  doctorId: idSchema,
  status: Joi.string().valid(...Object.values(APPOINTMENT_STATUS)),
  date: dateOnlySchema,
});

module.exports = {
  list: listQuery,
  create: buildCreateSchema({
    patientId: idSchema,
    doctorId: idSchema,
    scheduledAt: futureDateSchema,
  }),
  update: buildPartialSchema({
    scheduledAt: futureDateSchema,
    status: Joi.string().valid(...Object.values(APPOINTMENT_STATUS)),
  }),
};
