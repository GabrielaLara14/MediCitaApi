// Controlador genérico: traduce solicitudes HTTP en llamadas al servicio y arma la respuesta.
const { HTTP_STATUS } = require('../env/constants');

class CrudController {
  // Recibe el servicio del recurso (pacientes, médicos, etc.) que hará el trabajo real.
  constructor(service) {
    this.service = service;
  }

  // Lista registros según los filtros validados y el usuario autenticado.
  list = async (request, response) => {
    response.json(await this.service.list(request.filters, request.user));
  };

  // Devuelve un registro por su id.
  getById = async (request, response) => {
    response.json(await this.service.getById(request.params.id, request.user));
  };

  // Crea un registro y responde 201 con el registro creado.
  create = async (request, response) => {
    const createdRecord = await this.service.create(request.body, request.user);
    response.status(HTTP_STATUS.CREATED).json(createdRecord);
  };

  // Actualiza los campos enviados y devuelve el registro actualizado.
  update = async (request, response) => {
    response.json(await this.service.update(request.params.id, request.body, request.user));
  };

  // Elimina un registro y responde 204 (sin cuerpo).
  remove = async (request, response) => {
    await this.service.remove(request.params.id, request.user);
    response.status(HTTP_STATUS.NO_CONTENT).send();
  };
}

module.exports = CrudController;
