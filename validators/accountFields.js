// Campos comunes de las cuentas (nombre, correo y contraseña), compartidos por administradores y pacientes.
const { emailSchema, nameSchema, passwordSchema } = require('./common');

const accountFields = {
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
};

module.exports = { accountFields };
