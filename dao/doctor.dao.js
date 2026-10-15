// DAO de la tabla doctor (médicos), con filtros propios de especialidad y búsqueda por texto.
const BaseDao = require('./base.dao');

class DoctorDao extends BaseDao {
  constructor() {
    super({
      table: 'doctor',
      idColumn: 'id_doctor',
      // propiedad de la API: columna de la base de datos.
      columns: {
        name: 'name',
        specialty: 'specialty',
        schedule: 'working_hours',
        consultationFee: 'consultation_fee',
        biography: 'biography',
      },
    });
  }

  // "specialty" filtra por especialidad exacta; "search" busca el texto dentro del nombre o la especialidad.
  buildFilters({ specialty, search }) {
    const clauses = [];
    const values = [];

    if (specialty) {
      clauses.push('specialty = ?');
      values.push(specialty);
    }
    if (search) {
      // Los % hacen que LIKE encuentre el texto en cualquier parte.
      const searchPattern = `%${search}%`;
      clauses.push('(name LIKE ? OR specialty LIKE ?)');
      values.push(searchPattern, searchPattern);
    }
    return { clauses, values };
  }
}

module.exports = DoctorDao;
