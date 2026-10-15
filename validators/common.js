const Joi = require('joi');
const { DATE_ONLY_PATTERN, FIELD_LENGTH, MONTH_PATTERN } = require('../env/constants');

const idSchema = Joi.number().integer().positive();

const nameSchema = Joi.string().trim().min(FIELD_LENGTH.NAME.MIN).max(FIELD_LENGTH.NAME.MAX);

const emailSchema = Joi.string().trim().lowercase().email().max(FIELD_LENGTH.EMAIL);

const passwordSchema = Joi.string().min(FIELD_LENGTH.PASSWORD.MIN).max(FIELD_LENGTH.PASSWORD.MAX);

function buildCreateSchema(fields, requiredKeys = Object.keys(fields)) {
  return Joi.object(fields).fork(requiredKeys, (field) => field.required());
}

function buildPartialSchema(fields) {
  return Joi.object(fields).min(1);
}

const noQuerySchema = Joi.object({});

const dateOnlySchema = Joi.string()
  .pattern(DATE_ONLY_PATTERN)
  .custom((value, helpers) => (Number.isNaN(Date.parse(value)) ? helpers.error('any.invalid') : value));

const monthSchema = Joi.string().pattern(MONTH_PATTERN);

module.exports = {
  idSchema,
  nameSchema,
  emailSchema,
  passwordSchema,
  buildCreateSchema,
  buildPartialSchema,
  noQuerySchema,
  dateOnlySchema,
  monthSchema,
};
