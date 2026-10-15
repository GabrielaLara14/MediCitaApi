// Reglas de negocio de las reseñas: cada reseña se vincula a una cita completada.
const { APPOINTMENT_STATUS, HTTP_STATUS } = require('../env/constants');
const HttpError = require('../errors/HttpError');
const CrudService = require('./crud.service');

class ReviewService extends CrudService {
  constructor(dao, appointmentService) {
    super(dao, 'Reseña');
    this.appointmentService = appointmentService;
  }

  // El permiso sobre una reseña es el mismo que sobre su cita: si no puedes ver la cita, no ves la reseña.
  async getById(id, user) {
    const review = await this.findOrFail(id);
    await this.appointmentService.getById(review.appointmentId, user);
    return review;
  }

  // Solo se puede reseñar una cita propia y ya completada.
  async create({ appointmentId, ...reviewData }, user) {
    const appointment = await this.appointmentService.getById(appointmentId, user);
    if (appointment.status !== APPOINTMENT_STATUS.COMPLETED) {
      throw new HttpError(
        HTTP_STATUS.CONFLICT,
        `Solo se pueden reseñar citas en estado ${APPOINTMENT_STATUS.COMPLETED}`,
      );
    }

    // El médico se toma de la cita, no del cuerpo de la solicitud.
    return super.create({ ...reviewData, appointmentId, doctorId: appointment.doctorId });
  }

  // Verifica los permisos y luego actualiza.
  async update(id, data, user) {
    await this.getById(id, user);
    return super.update(id, data);
  }

  // Verifica los permisos y luego elimina.
  async remove(id, user) {
    await this.getById(id, user);
    return super.remove(id);
  }
}

module.exports = ReviewService;
