const { assertPatientOwnership, scopeFiltersToUser } = require('../utils/accessControl');
const CrudService = require('./crud.service');

class PatientOwnedService extends CrudService {
  list(filters, user) {
    return super.list(scopeFiltersToUser(filters, user));
  }

  async getById(id, user) {
    const record = await this.findOrFail(id);
    assertPatientOwnership(user, record.patientId);
    return record;
  }
}

module.exports = PatientOwnedService;
