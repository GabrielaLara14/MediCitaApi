// DAO de la tabla appointment (citas), con consultas propias además del CRUD base.
const db = require('../services/mysql.service');
const { APPOINTMENT_STATUS } = require('../env/constants');
const { getDayRange } = require('../utils/period');
const BaseDao = require('./base.dao');

class AppointmentDao extends BaseDao {
  constructor() {
    super({
      table: 'appointment',
      idColumn: 'id_appointment',
      // propiedad de la API: columna de la base de datos.
      columns: {
        patientId: 'id_patient',
        doctorId: 'id_doctor',
        scheduledAt: 'date_time',
        price: 'price',
        status: 'status',
      },
    });
  }

  // Filtros de listado: los campos normales filtran por igualdad y "date" filtra por un día completo.
  buildFilters({ date, ...columnFilters }) {
    const { clauses, values } = super.buildFilters(columnFilters);

    if (date) {
      const { start, end } = getDayRange(date);
      clauses.push('date_time >= ? AND date_time < ?');
      values.push(start, end);
    }
    return { clauses, values };
  }

  // Busca una cita no cancelada del médico a esa hora exacta (para evitar horarios repetidos).
  async findActiveByDoctorAndDate(doctorId, scheduledAt) {
    const [rows] = await db.execute(
      `SELECT ${this.selectClause} FROM ${this.table} WHERE id_doctor = ? AND date_time = ? AND status <> ?`,
      [doctorId, scheduledAt, APPOINTMENT_STATUS.CANCELLED],
    );
    return rows[0] ?? null;
  }

  // Lista las citas no canceladas entre dos fechas (inicio incluido, fin excluido), ordenadas por hora.
  async findActiveBetween(start, end) {
    const [rows] = await db.execute(
      `SELECT ${this.selectClause} FROM ${this.table} WHERE status <> ? AND date_time >= ? AND date_time < ? ORDER BY date_time`,
      [APPOINTMENT_STATUS.CANCELLED, start, end],
    );
    return rows;
  }
}

module.exports = AppointmentDao;
