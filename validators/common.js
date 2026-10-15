// Esquemas Joi reutilizables y constructores de esquemas para los demás validadores.
const Joi = require('joi');
const { DATE_ONLY_PATTERN, FIELD_LENGTH, MONTH_PATTERN } = require('../env/constants');

// Identificador: número entero positivo.
const idSchema = Joi.number().integer().positive();

// Nombre: sin espacios sobrantes y con longitud mínima y máxima.
const nameSchema = Joi.string().trim().min(FIELD_LENGTH.NAME.MIN).max(FIELD_LENGTH.NAME.MAX);

// Correo: formato válido, sin espacios y convertido a minúsculas.
const emailSchema = Joi.string().trim().lowercase().email().max(FIELD_LENGTH.EMAIL);

// Contraseña: longitud entre 8 y 72 (72 es el máximo que admite bcrypt).
const passwordSchema = Joi.string().min(FIELD_LENGTH.PASSWORD.MIN).max(FIELD_LENGTH.PASSWORD.MAX);

// Esquema para crear: por defecto todos los campos son obligatorios, o solo los de requiredKeys.
function buildCreateSchema(fields, requiredKeys = Object.keys(fields)) {
  return Joi.object(fields).fork(requiredKeys, (field) => field.required());
}

// Esquema para actualizar: todos los campos son opcionales, pero debe venir al menos uno.
function buildPartialSchema(fields) {
  return Joi.object(fields).min(1);
}

// Esquema que no admite ningún parámetro de consulta.
const noQuerySchema = Joi.object({});

// Fecha AAAA-MM-DD que además sea una fecha real (rechaza, por ejemplo, 2026-02-31).
const dateOnlySchema = Joi.string()
  .pattern(DATE_ONLY_PATTERN)
  .custom((value, helpers) => (Number.isNaN(Date.parse(value)) ? helpers.error('any.invalid') : value));

// Mes con formato AAAA-MM.
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
