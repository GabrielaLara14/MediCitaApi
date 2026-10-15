const BaseDao = require('./base.dao');

module.exports = new BaseDao({
  table: 'exam',
  idColumn: 'id_exam',
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
