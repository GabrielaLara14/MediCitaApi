const Joi = require('joi');
const { EXAM_TYPES, FIELD_LENGTH, MAX_MONEY_VALUE } = require('../env/constants');
const { buildPartialSchema, idSchema } = require('./common');

const resultFields = {
  numericValue: Joi.number().min(-MAX_MONEY_VALUE).max(MAX_MONEY_VALUE).precision(2),
  referenceRange: Joi.string().trim().max(FIELD_LENGTH.REFERENCE_RANGE),
  qualitativeResult: Joi.string().trim().max(FIELD_LENGTH.QUALITATIVE_RESULT),
  imageReport: Joi.string().trim().max(FIELD_LENGTH.IMAGE_REPORT),
  imageUrl: Joi.string().trim().uri().max(FIELD_LENGTH.IMAGE_URL),
};

function requiredForType(field, examType) {
  return field.when('type', { is: examType, then: Joi.required() });
}

const create = Joi.object({
  patientId: idSchema.required(),
  type: Joi.string()
    .valid(...Object.values(EXAM_TYPES))
    .required(),
  ...resultFields,
  numericValue: requiredForType(resultFields.numericValue, EXAM_TYPES.QUANTITATIVE),
  qualitativeResult: requiredForType(resultFields.qualitativeResult, EXAM_TYPES.QUALITATIVE),
  imageUrl: requiredForType(resultFields.imageUrl, EXAM_TYPES.IMAGING),
});

const listQuery = Joi.object({
  patientId: idSchema,
  type: Joi.string().valid(...Object.values(EXAM_TYPES)),
});

module.exports = {
  list: listQuery,
  create,
  update: buildPartialSchema(resultFields),
};
