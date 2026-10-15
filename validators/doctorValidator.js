const Joi = require('joi');
const { FIELD_LENGTH, MAX_MONEY_VALUE } = require('../env/constants');
const { buildCreateSchema, buildPartialSchema, nameSchema } = require('./common');

const doctorFields = {
  name: nameSchema,
  specialty: Joi.string().trim().min(1).max(FIELD_LENGTH.SPECIALTY),
  schedule: Joi.string().trim().min(1).max(FIELD_LENGTH.SCHEDULE),
  consultationFee: Joi.number().min(0).max(MAX_MONEY_VALUE).precision(2),
  biography: Joi.string().trim().allow('').max(FIELD_LENGTH.BIOGRAPHY),
};

const listQuery = Joi.object({
  specialty: Joi.string().trim().min(1).max(FIELD_LENGTH.SPECIALTY),
  search: Joi.string().trim().min(1).max(FIELD_LENGTH.SEARCH_TERM),
});

module.exports = {
  list: listQuery,
  create: buildCreateSchema(doctorFields, ['name', 'specialty', 'schedule', 'consultationFee']),
  update: buildPartialSchema(doctorFields),
};
