// Rutas CRUD de médicos: consultar es para cualquier usuario autenticado; crear, editar y borrar, solo administrador.
const { Router } = require('express');
const CrudController = require('../controllers/crud.controller');
const { adminAccess, authenticatedAccess } = require('../middlewares/accessRules');
const { cacheCatalog } = require('../middlewares/cacheControl');
const { doctorService } = require('../services/index');
const doctorValidator = require('../validators/doctorValidator');
const buildCrudRouter = require('./buildCrudRouter');

const router = Router();

// El listado y el detalle de médicos se pueden guardar en caché (catálogo que cambia poco).
router.get(['/', '/:id'], cacheCatalog);
router.use(
  buildCrudRouter(new CrudController(doctorService), {
    schemas: doctorValidator,
    defaultAccess: adminAccess,
    // Excepción: listar y consultar un médico no requieren ser administrador.
    access: { list: authenticatedAccess, get: authenticatedAccess },
  }),
);

module.exports = router;
