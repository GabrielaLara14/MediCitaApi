const CrudController = require('../controllers/crud.controller');
const { appointmentService } = require('../services/index');
const appointmentValidator = require('../validators/appointmentValidator');
const buildCrudRouter = require('./buildCrudRouter');

module.exports = buildCrudRouter(new CrudController(appointmentService), {
  schemas: appointmentValidator,
});
