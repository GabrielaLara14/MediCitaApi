const db = require('../services/mysql.service');
const { APPOINTMENT_STATUS } = require('../env/constants');
const { getDayRange } = require('../utils/period');
const BaseDao = require('./base.dao');

class AppointmentDao extends BaseDao {
  constructor() {
    super({
      table: 'appointment',
      idColumn: 'id_appointment',
      columns: {
        patientId: 'id_patient',
        doctorId: 'id_doctor',
        scheduledAt: 'date_time',
        price: 'price',
        status: 'status',
      },
    });
  }

  buildFilters({ date, ...columnFilters }) {
    const { clauses, values } = super.buildFilters(columnFilters);

    if (date) {
      const { start, end } = getDayRange(date);
      clauses.push('date_time >= ? AND date_time < ?');
      values.push(start, end);
    }
    return { clauses, values };
  }

  async findActiveByDoctorAndDate(doctorId, scheduledAt) {
    const [rows] = await db.execute(
      `SELECT ${this.selectClause} FROM ${this.table} WHERE id_doctor = ? AND date_time = ? AND status <> ?`,
      [doctorId, scheduledAt, APPOINTMENT_STATUS.CANCELLED],
    );
    return rows[0] ?? null;
  }

  async findActiveBetween(start, end) {
    const [rows] = await db.execute(
      `SELECT ${this.selectClause} FROM ${this.table} WHERE status <> ? AND date_time >= ? AND date_time < ? ORDER BY date_time`,
      [APPOINTMENT_STATUS.CANCELLED, start, end],
    );
    return rows;
  }
}

module.exports = AppointmentDao;
