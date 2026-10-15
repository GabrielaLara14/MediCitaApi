const Joi = require('joi');
const { ROLES } = require('../env/constants');
const { buildCreateSchema, emailSchema } = require('./common');

module.exports = {
  create: buildCreateSchema({
    email: emailSchema,
    password: Joi.string(),
    role: Joi.string().valid(...Object.values(ROLES)),
  }),
};
