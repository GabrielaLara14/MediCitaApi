const { HTTP_STATUS } = require('../env/constants');
const HttpError = require('../errors/HttpError');

class CrudService {
  constructor(dao, resourceLabel) {
    this.dao = dao;
    this.resourceLabel = resourceLabel;
  }

  list(filters) {
    return this.dao.findAll(filters);
  }

  getById(id) {
    return this.findOrFail(id);
  }

  create(data) {
    return this.dao.create(data);
  }

  async update(id, data) {
    await this.findOrFail(id);
    return this.dao.update(id, data);
  }

  async remove(id) {
    const wasRemoved = await this.dao.remove(id);
    if (!wasRemoved) {
      throw this.notFoundError();
    }
  }

  async findOrFail(id) {
    const record = await this.dao.findById(id);
    if (!record) {
      throw this.notFoundError();
    }
    return record;
  }

  notFoundError() {
    return new HttpError(HTTP_STATUS.NOT_FOUND, `${this.resourceLabel} no encontrado`);
  }
}

module.exports = CrudService;
