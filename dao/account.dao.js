// DAO para tablas de cuentas (admin, patient): añade la búsqueda de credenciales para iniciar sesión.
const db = require('../services/mysql.service');
const BaseDao = require('./base.dao');

class AccountDao extends BaseDao {
  // Devuelve el id y el hash de la contraseña del correo indicado, o null si no existe.
  async findCredentialsByEmail(email) {
    // El "?" es un parámetro preparado: evita inyección SQL.
    const [rows] = await db.execute(
      `SELECT ${this.idColumn} AS id, password_hash AS passwordHash FROM ${this.table} WHERE email = ?`,
      [email],
    );
    return rows[0] ?? null;
  }
}

module.exports = AccountDao;
