const { accountFields } = require('./accountFields');
const { buildCreateSchema, buildPartialSchema } = require('./common');

module.exports = {
  create: buildCreateSchema(accountFields),
  update: buildPartialSchema(accountFields),
};
