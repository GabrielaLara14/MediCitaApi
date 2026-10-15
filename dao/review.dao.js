// DAO de la tabla review (reseñas): guarda las etiquetas como JSON y cuenta reseñas por calificación.
const db = require('../services/mysql.service');
const BaseDao = require('./base.dao');

// Convierte la lista de etiquetas en texto JSON para guardarla en una sola columna.
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
      // propiedad de la API: columna de la base de datos.
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

  // Cuenta cuántas reseñas hay por calificación; si se da doctorId, solo cuenta las de ese médico.
  async countByRating(doctorId) {
    const { clauses, values } = this.buildFilters({ doctorId });
    const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';

    const [rows] = await db.execute(
      `SELECT rating, COUNT(*) AS total FROM ${this.table} ${whereClause} GROUP BY rating`,
      values,
    );
    return rows;
  }

  // Al crear y al actualizar, convierte las etiquetas a JSON antes de guardar.
  create(data) {
    return super.create(serializeTags(data));
  }

  update(id, data) {
    return super.update(id, serializeTags(data));
  }
}

module.exports = ReviewDao;
