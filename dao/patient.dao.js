// DAO de la tabla patient (pacientes): define sus columnas e incluye la búsqueda de credenciales.
const AccountDao = require('./account.dao');

module.exports = new AccountDao({
  table: 'patient',
  idColumn: 'id_patient',
  // propiedad de la API: columna de la base de datos.
  columns: {
    name: 'name',
    email: 'email',
    phone: 'phone',
  },
  // El hash se puede escribir pero nunca se devuelve en las consultas.
  secretColumns: { passwordHash: 'password_hash' },
});
