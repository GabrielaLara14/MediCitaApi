const { Router } = require('express');
const { authenticatedAccess } = require('../middlewares/accessRules');
const { validateBody, validateIdParam, validateQuery } = require('../middlewares/validateRequest');
const { noQuerySchema } = require('../validators/common');
const asyncHandler = require('../utils/asyncHandler');

module.exports = function buildCrudRouter(
  controller,
  { schemas, defaultAccess = authenticatedAccess, access = {} },
) {
  const router = Router();
  const accessFor = (operation) => access[operation] ?? defaultAccess;

  router.get(
    '/',
    ...accessFor('list'),
    validateQuery(schemas.list ?? noQuerySchema),
    asyncHandler(controller.list),
  );
  router.post('/', ...accessFor('create'), validateBody(schemas.create), asyncHandler(controller.create));
  router.get('/:id', validateIdParam, ...accessFor('get'), asyncHandler(controller.getById));
  router.patch(
    '/:id',
    validateIdParam,
    ...accessFor('update'),
    validateBody(schemas.update),
    asyncHandler(controller.update),
  );
  router.delete('/:id', validateIdParam, ...accessFor('remove'), asyncHandler(controller.remove));

  return router;
};
