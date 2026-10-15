// Reglas de negocio de las citas.
const { APPOINTMENT_STATUS, HTTP_STATUS } = require('../env/constants');
const HttpError = require('../errors/HttpError');
const { assertPatientOwnership } = require('../utils/accessControl');
const PatientOwnedService = require('./patientOwned.service');

class AppointmentService extends PatientOwnedService {
  // Necesita los servicios de pacientes y médicos para comprobar que ambos existen.
  constructor(dao, patientService, doctorService) {
    super(dao, 'Cita');
    this.patientService = patientService;
    this.doctorService = doctorService;
  }

  // Crea una cita: un paciente solo agenda para sí mismo, el médico debe existir y su horario estar libre.
  async create({ patientId, doctorId, scheduledAt }, user) {
    assertPatientOwnership(user, patientId);
    // Estas dos consultas lanzan 404 si el paciente o el médico no existen.
    await this.patientService.getById(patientId);
    const doctor = await this.doctorService.getById(doctorId);
    await this.ensureSlotIsFree(doctorId, scheduledAt);

    return super.create({
      patientId,
      doctorId,
      scheduledAt,
      // El precio se copia de la tarifa actual del médico, así no cambia si la tarifa se modifica después.
      price: doctor.consultationFee,
    });
  }

  // Solo se pueden modificar citas programadas; si cambia la fecha, el nuevo horario debe estar libre.
  async update(id, data, user) {
    const appointment = await this.getById(id, user);
    if (appointment.status !== APPOINTMENT_STATUS.SCHEDULED) {
      throw new HttpError(
        HTTP_STATUS.CONFLICT,
        `Solo se pueden modificar citas en estado ${APPOINTMENT_STATUS.SCHEDULED}`,
      );
    }
    if (data.scheduledAt) {
      // Se ignora la propia cita para que no choque consigo misma.
      await this.ensureSlotIsFree(appointment.doctorId, data.scheduledAt, id);
    }
    return super.update(id, data);
  }

  // Verifica que la cita exista y pertenezca al usuario antes de eliminarla.
  async remove(id, user) {
    await this.getById(id, user);
    return super.remove(id);
  }

  // Lanza 409 si el médico ya tiene otra cita no cancelada a esa misma hora.
  async ensureSlotIsFree(doctorId, scheduledAt, ignoredAppointmentId) {
    const occupiedBy = await this.dao.findActiveByDoctorAndDate(doctorId, scheduledAt);
    if (occupiedBy && occupiedBy.id !== ignoredAppointmentId) {
      throw new HttpError(HTTP_STATUS.CONFLICT, 'El medico ya tiene una cita en ese horario');
    }
  }
}

module.exports = AppointmentService;
