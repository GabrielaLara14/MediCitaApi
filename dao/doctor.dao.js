const BaseDao = require('./base.dao');

class DoctorDao extends BaseDao {
  constructor() {
    super({
      table: 'doctor',
      idColumn: 'id_doctor',
      columns: {
        name: 'name',
        specialty: 'specialty',
        schedule: 'working_hours',
        consultationFee: 'consultation_fee',
        biography: 'biography',
      },
    });
  }

  buildFilters({ specialty, search }) {
    const clauses = [];
    const values = [];

    if (specialty) {
      clauses.push('specialty = ?');
      values.push(specialty);
    }
    if (search) {
      const searchPattern = `%${search}%`;
      clauses.push('(name LIKE ? OR specialty LIKE ?)');
      values.push(searchPattern, searchPattern);
    }
    return { clauses, values };
  }
}

module.exports = DoctorDao;
