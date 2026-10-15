const CrudController = require('../controllers/crud.controller');
const { adminAccess, publicAccess, selfOrAdminAccess } = require('../middlewares/accessRules');
const { patientService } = require('../services/index');
const patientValidator = require('../validators/patientValidator');
const buildCrudRouter = require('./buildCrudRouter');

module.exports = buildCrudRouter(new CrudController(patientService), {
  schemas: patientValidator,
  defaultAccess: selfOrAdminAccess,
  access: { list: adminAccess, create: publicAccess },
});
