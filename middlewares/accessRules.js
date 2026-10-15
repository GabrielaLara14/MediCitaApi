// Conjuntos de middlewares listos para indicar quién puede usar cada ruta.
const { ROLES } = require('../env/constants');
const { authenticate, requireRole, requireSelfOrAdmin } = require('./authentication');

// Sin restricción: cualquiera puede llamar.
const publicAccess = [];
// Requiere token válido, de cualquier rol.
const authenticatedAccess = [authenticate];
// Requiere token válido y rol administrador.
const adminAccess = [authenticate, requireRole(ROLES.ADMIN)];
// Administrador, o el paciente dueño del registro (el id de la ruta debe ser el suyo).
const selfOrAdminAccess = [authenticate, requireSelfOrAdmin];

module.exports = { publicAccess, authenticatedAccess, adminAccess, selfOrAdminAccess };
