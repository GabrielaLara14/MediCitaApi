// Rutas CRUD de reseñas: cualquier usuario autenticado (el servicio aplica las reglas de propiedad).
const CrudController = require('../controllers/crud.controller');
const { reviewService } = require('../services/index');
const reviewValidator = require('../validators/reviewValidator');
const buildCrudRouter = require('./buildCrudRouter');

module.exports = buildCrudRouter(new CrudController(reviewService), {
  schemas: reviewValidator,
});
