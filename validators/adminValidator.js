// Validaciones de administradores: al crear todos los campos son obligatorios; al actualizar, al menos uno.
const { accountFields } = require('./accountFields');
const { buildCreateSchema, buildPartialSchema } = require('./common');

module.exports = {
  create: buildCreateSchema(accountFields),
  update: buildPartialSchema(accountFields),
};
