const { HTTP_STATUS } = require('../env/constants');

class CrudController {
  constructor(service) {
    this.service = service;
  }

  list = async (request, response) => {
    response.json(await this.service.list(request.filters, request.user));
  };

  getById = async (request, response) => {
    response.json(await this.service.getById(request.params.id, request.user));
  };

  create = async (request, response) => {
    const createdRecord = await this.service.create(request.body, request.user);
    response.status(HTTP_STATUS.CREATED).json(createdRecord);
  };

  update = async (request, response) => {
    response.json(await this.service.update(request.params.id, request.body, request.user));
  };

  remove = async (request, response) => {
    await this.service.remove(request.params.id, request.user);
    response.status(HTTP_STATUS.NO_CONTENT).send();
  };
}

module.exports = CrudController;
