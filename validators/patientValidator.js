// Validaciones de pacientes: los campos de cuenta más el teléfono.
const Joi = require('joi');
const { FIELD_LENGTH, PHONE_PATTERN } = require('../env/constants');
const { accountFields } = require('./accountFields');
const { buildCreateSchema, buildPartialSchema } = require('./common');

const patientFields = {
  ...accountFields,
  // Teléfono: longitud limitada y solo dígitos, +, -, espacios y paréntesis.
  phone: Joi.string().trim().min(FIELD_LENGTH.PHONE.MIN).max(FIELD_LENGTH.PHONE.MAX).pattern(PHONE_PATTERN),
};

module.exports = {
  create: buildCreateSchema(patientFields),
  update: buildPartialSchema(patientFields),
};
