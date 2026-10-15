const AccountDao = require('./account.dao');

module.exports = new AccountDao({
  table: 'admin',
  idColumn: 'id_admin',
  columns: {
    name: 'name',
    email: 'email',
  },
  secretColumns: { passwordHash: 'password_hash' },
});
