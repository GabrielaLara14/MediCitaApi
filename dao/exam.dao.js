// DAO de la tabla exam (exámenes): usa el CRUD base sin consultas adicionales.
const BaseDao = require('./base.dao');

module.exports = new BaseDao({
  table: 'exam',
  idColumn: 'id_exam',
  // propiedad de la API: columna de la base de datos.
  columns: {
    patientId: 'id_patient',
    type: 'type',
    numericValue: 'numeric_value',
    referenceRange: 'reference_range',
    qualitativeResult: 'qualitative_result',
    imageReport: 'image_report',
    imageUrl: 'image_url',
  },
});
