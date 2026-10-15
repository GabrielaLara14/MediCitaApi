// Servicio para recursos que pertenecen a un paciente (citas, exámenes): un paciente solo accede a lo suyo.
const { assertPatientOwnership, scopeFiltersToUser } = require('../utils/accessControl');
const CrudService = require('./crud.service');

class PatientOwnedService extends CrudService {
  // Si quien lista es un paciente, se filtra automáticamente por su id.
  list(filters, user) {
    return super.list(scopeFiltersToUser(filters, user));
  }

  // Devuelve el registro solo si es del paciente que consulta (o si es administrador); si no, 403.
  async getById(id, user) {
    const record = await this.findOrFail(id);
    assertPatientOwnership(user, record.patientId);
    return record;
  }
}

module.exports = PatientOwnedService;
