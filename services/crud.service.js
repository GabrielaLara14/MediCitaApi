// Servicio base con las operaciones CRUD comunes; los demás servicios lo extienden y añaden sus reglas.
const { HTTP_STATUS } = require('../env/constants');
const HttpError = require('../errors/HttpError');

class CrudService {
  // dao: acceso a la base de datos. resourceLabel: nombre del recurso para los mensajes de error.
  constructor(dao, resourceLabel) {
    this.dao = dao;
    this.resourceLabel = resourceLabel;
  }

  // Lista registros aplicando los filtros recibidos.
  list(filters) {
    return this.dao.findAll(filters);
  }

  // Devuelve un registro o lanza 404 si no existe.
  getById(id) {
    return this.findOrFail(id);
  }

  // Inserta un registro nuevo.
  create(data) {
    return this.dao.create(data);
  }

  // Comprueba que exista (404 si no) y luego actualiza.
  async update(id, data) {
    await this.findOrFail(id);
    return this.dao.update(id, data);
  }

  // Elimina el registro; si no se borró ninguna fila, es porque no existía.
  async remove(id) {
    const wasRemoved = await this.dao.remove(id);
    if (!wasRemoved) {
      throw this.notFoundError();
    }
  }

  // Busca por id y lanza 404 si no hay resultado.
  async findOrFail(id) {
    const record = await this.dao.findById(id);
    if (!record) {
      throw this.notFoundError();
    }
    return record;
  }

  // Construye el error 404 con el nombre del recurso.
  notFoundError() {
    return new HttpError(HTTP_STATUS.NOT_FOUND, `${this.resourceLabel} no encontrado`);
  }
}

module.exports = CrudService;
