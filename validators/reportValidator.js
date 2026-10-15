// Validaciones de los parámetros de los reportes.
const Joi = require('joi');
const { dateOnlySchema, idSchema, monthSchema } = require('./common');

module.exports = {
  // Ingresos: se envía un día ("date") o un mes ("month"), pero exactamente uno de los dos.
  income: Joi.object({ date: dateOnlySchema, month: monthSchema }).xor('date', 'month'),
  // Estadísticas de reseñas: el médico es opcional.
  reviewStatistics: Joi.object({ doctorId: idSchema }),
};
