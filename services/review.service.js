const { APPOINTMENT_STATUS, HTTP_STATUS } = require('../env/constants');
const HttpError = require('../errors/HttpError');
const CrudService = require('./crud.service');

class ReviewService extends CrudService {
  constructor(dao, appointmentService) {
    super(dao, 'Reseña');
    this.appointmentService = appointmentService;
  }

  async getById(id, user) {
    const review = await this.findOrFail(id);
    await this.appointmentService.getById(review.appointmentId, user);
    return review;
  }

  async create({ appointmentId, ...reviewData }, user) {
    const appointment = await this.appointmentService.getById(appointmentId, user);
    if (appointment.status !== APPOINTMENT_STATUS.COMPLETED) {
      throw new HttpError(
        HTTP_STATUS.CONFLICT,
        `Solo se pueden reseñar citas en estado ${APPOINTMENT_STATUS.COMPLETED}`,
      );
    }

    return super.create({ ...reviewData, appointmentId, doctorId: appointment.doctorId });
  }

  async update(id, data, user) {
    await this.getById(id, user);
    return super.update(id, data);
  }

  async remove(id, user) {
    await this.getById(id, user);
    return super.remove(id);
  }
}

module.exports = ReviewService;
