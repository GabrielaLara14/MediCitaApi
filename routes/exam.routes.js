const CrudController = require('../controllers/crud.controller');
const { adminAccess, authenticatedAccess } = require('../middlewares/accessRules');
const { examService } = require('../services/index');
const examValidator = require('../validators/examValidator');
const buildCrudRouter = require('./buildCrudRouter');

module.exports = buildCrudRouter(new CrudController(examService), {
  schemas: examValidator,
  defaultAccess: adminAccess,
  access: { list: authenticatedAccess, get: authenticatedAccess },
});
