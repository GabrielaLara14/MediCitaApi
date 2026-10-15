// Servicio para cuentas con contraseña (administradores y pacientes): cifra la contraseña antes de guardarla.
const { hashPassword } = require('../utils/password');
const CrudService = require('./crud.service');

class AccountService extends CrudService {
  // Al crear, reemplaza la contraseña por su hash y delega en el CRUD genérico.
  async create(data) {
    return super.create(await this.replacePasswordWithHash(data));
  }

  // Al actualizar, hace lo mismo solo si se envió una contraseña nueva.
  async update(id, data) {
    return super.update(id, await this.replacePasswordWithHash(data));
  }

  // Separa "password" del resto de datos y devuelve "passwordHash" en su lugar (el texto plano nunca llega a la base).
  async replacePasswordWithHash({ password, ...accountData }) {
    if (password === undefined) {
      return accountData;
    }
    return { ...accountData, passwordHash: await hashPassword(password) };
  }
}

module.exports = AccountService;
