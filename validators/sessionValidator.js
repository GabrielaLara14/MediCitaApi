// Validación del inicio de sesión: correo, contraseña y rol son obligatorios.
const Joi = require('joi');
const { ROLES } = require('../env/constants');
const { buildCreateSchema, emailSchema } = require('./common');

module.exports = {
  create: buildCreateSchema({
    email: emailSchema,
    // Aquí no se limita la longitud: solo se compara con el hash guardado.
    password: Joi.string(),
    // Solo admite los roles definidos (admin o patient).
    role: Joi.string().valid(...Object.values(ROLES)),
  }),
};
