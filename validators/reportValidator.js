const Joi = require('joi');
const { dateOnlySchema, idSchema, monthSchema } = require('./common');

module.exports = {
  income: Joi.object({ date: dateOnlySchema, month: monthSchema }).xor('date', 'month'),
  reviewStatistics: Joi.object({ doctorId: idSchema }),
};
