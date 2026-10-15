const Joi = require('joi');
const { FIELD_LENGTH, MAX_TAGS_PER_REVIEW, MAX_WAIT_MINUTES, RATING_RANGE } = require('../env/constants');
const { buildCreateSchema, buildPartialSchema, idSchema } = require('./common');

const reviewFields = {
  rating: Joi.number().integer().min(RATING_RANGE.MIN).max(RATING_RANGE.MAX),
  comment: Joi.string().trim().allow('').max(FIELD_LENGTH.COMMENT),
  waitMinutes: Joi.number().integer().min(0).max(MAX_WAIT_MINUTES),
  tags: Joi.array().items(Joi.string().trim().min(1).max(FIELD_LENGTH.TAG)).max(MAX_TAGS_PER_REVIEW).unique(),
};

const listQuery = Joi.object({
  doctorId: idSchema,
  appointmentId: idSchema,
});

module.exports = {
  list: listQuery,
  create: buildCreateSchema({ appointmentId: idSchema, ...reviewFields }, ['appointmentId', 'rating']),
  update: buildPartialSchema(reviewFields),
};
