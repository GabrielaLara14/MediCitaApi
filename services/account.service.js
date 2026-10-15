const { hashPassword } = require('../utils/password');
const CrudService = require('./crud.service');

class AccountService extends CrudService {
  async create(data) {
    return super.create(await this.replacePasswordWithHash(data));
  }

  async update(id, data) {
    return super.update(id, await this.replacePasswordWithHash(data));
  }

  async replacePasswordWithHash({ password, ...accountData }) {
    if (password === undefined) {
      return accountData;
    }
    return { ...accountData, passwordHash: await hashPassword(password) };
  }
}

module.exports = AccountService;
