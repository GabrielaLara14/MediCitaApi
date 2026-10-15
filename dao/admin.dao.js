// DAO de la tabla admin: define qué columna de la base corresponde a cada propiedad de la API.
const AccountDao = require('./account.dao');

module.exports = new AccountDao({
  table: 'admin',
  idColumn: 'id_admin',
  // propiedad de la API: columna de la base de datos (estas columnas se devuelven al consultar).
  columns: {
    name: 'name',
    email: 'email',
  },
  // El hash se puede escribir pero nunca se devuelve en las consultas.
  secretColumns: { passwordHash: 'password_hash' },
});
