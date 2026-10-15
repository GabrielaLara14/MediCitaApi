const { emailSchema, nameSchema, passwordSchema } = require('./common');

const accountFields = {
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
};

module.exports = { accountFields };
