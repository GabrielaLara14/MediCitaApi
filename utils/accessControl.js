const { HTTP_STATUS, ROLES } = require('../env/constants');
const HttpError = require('../errors/HttpError');

function assertPatientOwnership(user, ownerPatientId) {
  if (user.role === ROLES.PATIENT && user.id !== ownerPatientId) {
    throw new HttpError(HTTP_STATUS.FORBIDDEN, 'No tienes permisos sobre este registro');
  }
}

function scopeFiltersToUser(filters, user) {
  return user.role === ROLES.PATIENT ? { ...filters, patientId: user.id } : filters;
}

module.exports = { assertPatientOwnership, scopeFiltersToUser };
