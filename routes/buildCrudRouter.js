// Fábrica de rutas: arma las 5 operaciones CRUD de un recurso para no repetir código en cada archivo de rutas.
const { Router } = require('express');
const { authenticatedAccess } = require('../middlewares/accessRules');
const { validateBody, validateIdParam, validateQuery } = require('../middlewares/validateRequest');
const { noQuerySchema } = require('../validators/common');
const asyncHandler = require('../utils/asyncHandler');

// controller: maneja cada operación. schemas: validaciones Joi del recurso.
// defaultAccess: protección general. access: excepciones por operación (list, create, get, update, remove).
module.exports = function buildCrudRouter(
  controller,
  { schemas, defaultAccess = authenticatedAccess, access = {} },
) {
  const router = Router();
  // Devuelve la protección específica de la operación, o la general si no hay una.
  const accessFor = (operation) => access[operation] ?? defaultAccess;

  // GET /  -> listar (si no hay esquema de filtros, no se admiten parámetros de consulta).
  router.get(
    '/',
    ...accessFor('list'),
    validateQuery(schemas.list ?? noQuerySchema),
    asyncHandler(controller.list),
  );
  // POST /  -> crear.
  router.post('/', ...accessFor('create'), validateBody(schemas.create), asyncHandler(controller.create));
  // GET /:id  -> consultar uno (primero se valida el id y después los permisos).
  router.get('/:id', validateIdParam, ...accessFor('get'), asyncHandler(controller.getById));
  // PATCH /:id  -> actualizar campos de un registro.
  router.patch(
    '/:id',
    validateIdParam,
    ...accessFor('update'),
    validateBody(schemas.update),
    asyncHandler(controller.update),
  );
  // DELETE /:id  -> eliminar.
  router.delete('/:id', validateIdParam, ...accessFor('remove'), asyncHandler(controller.remove));

  return router;
};
