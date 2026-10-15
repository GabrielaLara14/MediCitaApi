const AccountDao = require('./account.dao');

module.exports = new AccountDao({
  table: 'patient',
  idColumn: 'id_patient',
  columns: {
    name: 'name',
    email: 'email',
    phone: 'phone',
  },
  secretColumns: { passwordHash: 'password_hash' },
});
