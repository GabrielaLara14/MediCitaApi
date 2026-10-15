// Rutas CRUD de exámenes: consultar para cualquier usuario autenticado; crear, editar y borrar, solo administrador.
const CrudController = require('../controllers/crud.controller');
const { adminAccess, authenticatedAccess } = require('../middlewares/accessRules');
const { examService } = require('../services/index');
const examValidator = require('../validators/examValidator');
const buildCrudRouter = require('./buildCrudRouter');

module.exports = buildCrudRouter(new CrudController(examService), {
  schemas: examValidator,
  defaultAccess: adminAccess,
  // Excepción: listar y consultar (el servicio limita a cada paciente a sus exámenes).
  access: { list: authenticatedAccess, get: authenticatedAccess },
});
