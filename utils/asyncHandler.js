// Envuelve un controlador asíncrono para que cualquier error rechazado llegue al manejador de errores de Express.
module.exports = function asyncHandler(handler) {
  return (request, response, next) => {
    Promise.resolve(handler(request, response, next)).catch(next);
  };
};
