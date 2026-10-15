// Enrutador principal: asocia cada recurso con su ruta base dentro de /api.
const { Router } = require('express');
const adminRoutes = require('./admin.routes');
const appointmentRoutes = require('./appointment.routes');
const doctorRoutes = require('./doctor.routes');
const examRoutes = require('./exam.routes');
const patientRoutes = require('./patient.routes');
const reportRoutes = require('./report.routes');
const reviewRoutes = require('./review.routes');
const sessionRoutes = require('./session.routes');

const router = Router();

router.use('/sessions', sessionRoutes); // Inicio de sesión.
router.use('/admins', adminRoutes);
router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/exams', examRoutes);
router.use('/reviews', reviewRoutes);
// Los reportes definen sus propias rutas completas (/income-reports y /review-statistics).
router.use(reportRoutes);

module.exports = router;
