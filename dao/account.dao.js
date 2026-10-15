const db = require('../services/mysql.service');
const BaseDao = require('./base.dao');

class AccountDao extends BaseDao {
  async findCredentialsByEmail(email) {
    const [rows] = await db.execute(
      `SELECT ${this.idColumn} AS id, password_hash AS passwordHash FROM ${this.table} WHERE email = ?`,
      [email],
    );
    return rows[0] ?? null;
  }
}

module.exports = AccountDao;
