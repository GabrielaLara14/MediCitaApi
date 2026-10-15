const { ROLES } = require('../env/constants');
const { authenticate, requireRole, requireSelfOrAdmin } = require('./authentication');

const publicAccess = [];
const authenticatedAccess = [authenticate];
const adminAccess = [authenticate, requireRole(ROLES.ADMIN)];
const selfOrAdminAccess = [authenticate, requireSelfOrAdmin];

module.exports = { publicAccess, authenticatedAccess, adminAccess, selfOrAdminAccess };
