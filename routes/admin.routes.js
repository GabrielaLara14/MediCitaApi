const CrudController = require('../controllers/crud.controller');
const { adminAccess } = require('../middlewares/accessRules');
const { adminService } = require('../services/index');
const adminValidator = require('../validators/adminValidator');
const buildCrudRouter = require('./buildCrudRouter');

module.exports = buildCrudRouter(new CrudController(adminService), {
  schemas: adminValidator,
  defaultAccess: adminAccess,
});
