const { API_BASE_PATH, APPOINTMENT_STATUS, EXAM_TYPES, HTTP_STATUS } = require('../env/constants');
const { responses, schemas, securitySchemes } = require('./components');
const { ACCESS, buildCrudPaths, buildReportPath, buildSessionPath } = require('./crudPaths');

const { NOT_FOUND, CONFLICT, FORBIDDEN } = HTTP_STATUS;

const idQuery = { type: 'integer', minimum: 1 };
const dateQuery = { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' };
const monthQuery = { type: 'string', pattern: '^\\d{4}-(0[1-9]|1[0-2])$' };

const catalogCacheHeaders = {
  'Cache-Control': {
    description: 'Cache privada del catalogo de medicos',
    schema: { type: 'string', example: 'private, max-age=60' },
  },
};

const reports = [
  {
    tag: 'Reports',
    path: '/income-reports',
    summary: 'Reporte de ingresos por dia o por mes',
    description:
      'Requiere token con rol admin. Suma el precio de las citas no canceladas del periodo. ' +
      'Envia exactamente uno de los parametros date o month.',
    queryParameters: [
      { name: 'date', schema: dateQuery, example: '2027-02-10' },
      { name: 'month', schema: monthQuery, example: '2027-02' },
    ],
    responseSchema: 'IncomeReport',
  },
  {
    tag: 'Reports',
    path: '/review-statistics',
    summary: 'Estadisticas de reseñas: promedio y distribucion de calificaciones',
    description: 'Requiere token con rol admin. Con doctorId filtra por medico.',
    queryParameters: [{ name: 'doctorId', schema: idQuery, example: 1 }],
    responseSchema: 'ReviewStatistics',
  },
];

const resources = [
  {
    tag: 'Admins',
    path: '/admins',
    label: 'administrador',
    pluralLabel: 'administradores',
    schemaName: 'Admin',
    access: Object.fromEntries(
      ['list', 'create', 'get', 'update', 'remove'].map((operation) => [operation, ACCESS.ADMIN]),
    ),
    extraErrors: { create: [CONFLICT], update: [CONFLICT] },
  },
  {
    tag: 'Patients',
    path: '/patients',
    label: 'paciente',
    schemaName: 'Patient',
    access: {
      list: ACCESS.ADMIN,
      create: ACCESS.PUBLIC,
      get: ACCESS.SELF_OR_ADMIN,
      update: ACCESS.SELF_OR_ADMIN,
      remove: ACCESS.SELF_OR_ADMIN,
    },
    extraErrors: { create: [CONFLICT], update: [CONFLICT], remove: [CONFLICT] },
  },
  {
    tag: 'Doctors',
    path: '/doctors',
    label: 'médico',
    schemaName: 'Doctor',
    access: { create: ACCESS.ADMIN, update: ACCESS.ADMIN, remove: ACCESS.ADMIN },
    extraErrors: { remove: [CONFLICT] },
    listParameters: [
      { name: 'specialty', schema: { type: 'string' }, example: 'Cardiología' },
      { name: 'search', schema: { type: 'string' }, example: 'rivera' },
    ],
    listHeaders: catalogCacheHeaders,
  },
  {
    tag: 'Appointments',
    path: '/appointments',
    label: 'cita',
    schemaName: 'Appointment',
    extraErrors: {
      create: [NOT_FOUND, CONFLICT, FORBIDDEN],
      get: [FORBIDDEN],
      update: [CONFLICT, FORBIDDEN],
      remove: [FORBIDDEN],
    },
    listParameters: [
      { name: 'patientId', schema: idQuery, example: 1 },
      { name: 'doctorId', schema: idQuery, example: 1 },
      {
        name: 'status',
        schema: { type: 'string', enum: Object.values(APPOINTMENT_STATUS) },
        example: APPOINTMENT_STATUS.SCHEDULED,
      },
      { name: 'date', schema: dateQuery, example: '2027-02-10' },
    ],
  },
  {
    tag: 'Exams',
    path: '/exams',
    label: 'examen',
    schemaName: 'Exam',
    access: { create: ACCESS.ADMIN, update: ACCESS.ADMIN, remove: ACCESS.ADMIN },
    extraErrors: { get: [FORBIDDEN] },
    listParameters: [
      { name: 'patientId', schema: idQuery, example: 1 },
      {
        name: 'type',
        schema: { type: 'string', enum: Object.values(EXAM_TYPES) },
        example: EXAM_TYPES.QUANTITATIVE,
      },
    ],
  },
  {
    tag: 'Reviews',
    path: '/reviews',
    label: 'reseña',
    schemaName: 'Review',
    extraErrors: {
      create: [NOT_FOUND, CONFLICT, FORBIDDEN],
      get: [FORBIDDEN],
      update: [FORBIDDEN],
      remove: [FORBIDDEN],
    },
    listParameters: [
      { name: 'doctorId', schema: idQuery, example: 1 },
      { name: 'appointmentId', schema: idQuery, example: 2 },
    ],
  },
];

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'MediCita API',
    version: '1.0.0',
    description:
      'API REST de la plataforma de citas medicas MediCita. Para probar los endpoints protegidos, ' +
      'crea una sesion en POST /sessions y pega el token en el boton Authorize.',
  },
  servers: [{ url: API_BASE_PATH }],
  tags: [{ name: 'Sessions' }, ...resources.map(({ tag }) => ({ name: tag })), { name: 'Reports' }],
  paths: Object.assign(buildSessionPath(), ...resources.map(buildCrudPaths), ...reports.map(buildReportPath)),
  components: { schemas, responses, securitySchemes },
};
