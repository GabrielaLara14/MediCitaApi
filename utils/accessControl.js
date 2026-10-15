// Reglas de propiedad: un paciente solo puede ver y modificar sus propios registros.
const { HTTP_STATUS, ROLES } = require('../env/constants');
const HttpError = require('../errors/HttpError');

// Lanza 403 si quien consulta es un paciente y el registro pertenece a otro paciente.
function assertPatientOwnership(user, ownerPatientId) {
  if (user.role === ROLES.PATIENT && user.id !== ownerPatientId) {
    throw new HttpError(HTTP_STATUS.FORBIDDEN, 'No tienes permisos sobre este registro');
  }
}

// Si quien consulta es paciente, fuerza el filtro por su propio id para que solo vea sus datos.
function scopeFiltersToUser(filters, user) {
  return user.role === ROLES.PATIENT ? { ...filters, patientId: user.id } : filters;
}

module.exports = { assertPatientOwnership, scopeFiltersToUser };
