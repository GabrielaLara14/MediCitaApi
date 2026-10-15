const db = require('../services/mysql.service');
const BaseDao = require('./base.dao');

function serializeTags(data) {
  if (data.tags === undefined) {
    return data;
  }
  return { ...data, tags: JSON.stringify(data.tags) };
}

class ReviewDao extends BaseDao {
  constructor() {
    super({
      table: 'review',
      idColumn: 'id_review',
      columns: {
        appointmentId: 'id_appointment',
        doctorId: 'id_doctor',
        rating: 'rating',
        comment: 'comment',
        waitMinutes: 'wait_time_min',
        tags: 'tags',
      },
    });
  }

  async countByRating(doctorId) {
    const { clauses, values } = this.buildFilters({ doctorId });
    const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';

    const [rows] = await db.execute(
      `SELECT rating, COUNT(*) AS total FROM ${this.table} ${whereClause} GROUP BY rating`,
      values,
    );
    return rows;
  }

  create(data) {
    return super.create(serializeTags(data));
  }

  update(id, data) {
    return super.update(id, serializeTags(data));
  }
}

module.exports = ReviewDao;
