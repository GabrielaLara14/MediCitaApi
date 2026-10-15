const { Router } = require('express');
const CrudController = require('../controllers/crud.controller');
const { adminAccess, authenticatedAccess } = require('../middlewares/accessRules');
const { cacheCatalog } = require('../middlewares/cacheControl');
const { doctorService } = require('../services/index');
const doctorValidator = require('../validators/doctorValidator');
const buildCrudRouter = require('./buildCrudRouter');

const router = Router();

router.get(['/', '/:id'], cacheCatalog);
router.use(
  buildCrudRouter(new CrudController(doctorService), {
    schemas: doctorValidator,
    defaultAccess: adminAccess,
    access: { list: authenticatedAccess, get: authenticatedAccess },
  }),
);

module.exports = router;
