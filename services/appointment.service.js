const { APPOINTMENT_STATUS, HTTP_STATUS } = require('../env/constants');
const HttpError = require('../errors/HttpError');
const { assertPatientOwnership } = require('../utils/accessControl');
const PatientOwnedService = require('./patientOwned.service');

class AppointmentService extends PatientOwnedService {
  constructor(dao, patientService, doctorService) {
    super(dao, 'Cita');
    this.patientService = patientService;
    this.doctorService = doctorService;
  }

  async create({ patientId, doctorId, scheduledAt }, user) {
    assertPatientOwnership(user, patientId);
    await this.patientService.getById(patientId);
    const doctor = await this.doctorService.getById(doctorId);
    await this.ensureSlotIsFree(doctorId, scheduledAt);

    return super.create({
      patientId,
      doctorId,
      scheduledAt,
      price: doctor.consultationFee,
    });
  }

  async update(id, data, user) {
    const appointment = await this.getById(id, user);
    if (appointment.status !== APPOINTMENT_STATUS.SCHEDULED) {
      throw new HttpError(
        HTTP_STATUS.CONFLICT,
        `Solo se pueden modificar citas en estado ${APPOINTMENT_STATUS.SCHEDULED}`,
      );
    }
    if (data.scheduledAt) {
      await this.ensureSlotIsFree(appointment.doctorId, data.scheduledAt, id);
    }
    return super.update(id, data);
  }

  async remove(id, user) {
    await this.getById(id, user);
    return super.remove(id);
  }

  async ensureSlotIsFree(doctorId, scheduledAt, ignoredAppointmentId) {
    const occupiedBy = await this.dao.findActiveByDoctorAndDate(doctorId, scheduledAt);
    if (occupiedBy && occupiedBy.id !== ignoredAppointmentId) {
      throw new HttpError(HTTP_STATUS.CONFLICT, 'El medico ya tiene una cita en ese horario');
    }
  }
}

module.exports = AppointmentService;
