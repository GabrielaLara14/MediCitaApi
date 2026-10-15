// Rutas CRUD de pacientes: registrarse es público; listar, solo administrador; el resto, administrador o el propio paciente.
const CrudController = require('../controllers/crud.controller');
const { adminAccess, publicAccess, selfOrAdminAccess } = require('../middlewares/accessRules');
const { patientService } = require('../services/index');
const patientValidator = require('../validators/patientValidator');
const buildCrudRouter = require('./buildCrudRouter');

module.exports = buildCrudRouter(new CrudController(patientService), {
  schemas: patientValidator,
  defaultAccess: selfOrAdminAccess,
  // Excepciones: listar solo admin; crear sin token (registro de nuevos pacientes).
  access: { list: adminAccess, create: publicAccess },
});
