// Punto único donde se crean los servicios y se conectan con sus DAO (acceso a datos) y entre sí.
const { ROLES } = require('../env/constants');
const DoctorDao = require('../dao/doctor.dao');
const AppointmentDao = require('../dao/appointment.dao');
const ReviewDao = require('../dao/review.dao');
const adminDao = require('../dao/admin.dao');
const examDao = require('../dao/exam.dao');
const patientDao = require('../dao/patient.dao');
const AccountService = require('./account.service');
const AppointmentService = require('./appointment.service');
const CrudService = require('./crud.service');
const IncomeReportService = require('./incomeReport.service');
const PatientOwnedService = require('./patientOwned.service');
const ReviewService = require('./review.service');
const ReviewStatisticsService = require('./reviewStatistics.service');
const SessionService = require('./session.service');

// Servicios sencillos: cada uno recibe su DAO y el nombre del recurso para los mensajes de error.
const adminService = new AccountService(adminDao, 'Administrador');
const patientService = new AccountService(patientDao, 'Paciente');
const doctorService = new CrudService(new DoctorDao(), 'Médico');
const examService = new PatientOwnedService(examDao, 'Examen');
// Estos DAO se crean aparte porque más de un servicio los usa.
const appointmentDao = new AppointmentDao();
const reviewDao = new ReviewDao();

// Servicios que dependen de otros servicios o DAO.
const appointmentService = new AppointmentService(appointmentDao, patientService, doctorService);
const reviewService = new ReviewService(reviewDao, appointmentService);
const incomeReportService = new IncomeReportService(appointmentDao);
const reviewStatisticsService = new ReviewStatisticsService(reviewDao);
// El servicio de sesión elige en qué tabla buscar las credenciales según el rol.
const sessionService = new SessionService({
  [ROLES.ADMIN]: adminDao,
  [ROLES.PATIENT]: patientDao,
});

module.exports = {
  adminService,
  patientService,
  doctorService,
  examService,
  appointmentService,
  reviewService,
  incomeReportService,
  reviewStatisticsService,
  sessionService,
};
