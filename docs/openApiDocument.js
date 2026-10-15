// Arma el documento OpenAPI (la descripción de la API que Swagger convierte en la página interactiva).
const { API_BASE_PATH, APPOINTMENT_STATUS, EXAM_TYPES, HTTP_STATUS } = require('../env/constants');
const { responses, schemas, securitySchemes } = require('./components');
const { ACCESS, buildCrudPaths, buildReportPath, buildSessionPath } = require('./crudPaths');

const { NOT_FOUND, CONFLICT, FORBIDDEN } = HTTP_STATUS;

// Tipos de parámetros de consulta que se repiten: id, fecha (AAAA-MM-DD) y mes (AAAA-MM).
const idQuery = { type: 'integer', minimum: 1 };
const dateQuery = { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' };
const monthQuery = { type: 'string', pattern: '^\\d{4}-(0[1-9]|1[0-2])$' };

// Encabezado de caché que se documenta en el listado de médicos.
const catalogCacheHeaders = {
  'Cache-Control': {
    description: 'Cache privada del catalogo de medicos',
    schema: { type: 'string', example: 'private, max-age=60' },
  },
};

// Endpoints de reportes: cada uno se convierte en una ruta GET documentada.
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

// Recursos CRUD. Por cada uno se generan las rutas de listar, crear, consultar, actualizar y eliminar.
// access: quién puede usar cada operación (si no se indica, cualquier usuario autenticado).
// extraErrors: errores adicionales que se documentan además de los comunes.
const resources = [
  {
    tag: 'Admins',
    path: '/admins',
    label: 'administrador',
    pluralLabel: 'administradores',
    schemaName: 'Admin',
    // Las cinco operaciones requieren rol administrador.
    access: Object.fromEntries(
      ['list', 'create', 'get', 'update', 'remove'].map((operation) => [operation, ACCESS.ADMIN]),
    ),
    // 409: correo duplicado al crear o actualizar.
    extraErrors: { create: [CONFLICT], update: [CONFLICT] },
  },
  {
    tag: 'Patients',
    path: '/patients',
    label: 'paciente',
    schemaName: 'Patient',
    access: {
      list: ACCESS.ADMIN,
      // El registro de pacientes es público (no requiere token).
      create: ACCESS.PUBLIC,
      get: ACCESS.SELF_OR_ADMIN,
      update: ACCESS.SELF_OR_ADMIN,
      remove: ACCESS.SELF_OR_ADMIN,
    },
    // 409: correo duplicado, o paciente con citas al eliminarlo.
    extraErrors: { create: [CONFLICT], update: [CONFLICT], remove: [CONFLICT] },
  },
  {
    tag: 'Doctors',
    path: '/doctors',
    label: 'médico',
    schemaName: 'Doctor',
    // Listar y consultar son para cualquier usuario autenticado; el resto, solo admin.
    access: { create: ACCESS.ADMIN, update: ACCESS.ADMIN, remove: ACCESS.ADMIN },
    // 409: médico con citas al eliminarlo.
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
    // 404: paciente o médico inexistente; 409: horario ocupado o cita ya no modificable; 403: cita de otro paciente.
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
    // Listar y consultar para cualquier usuario autenticado; crear, editar y borrar, solo admin.
    access: { create: ACCESS.ADMIN, update: ACCESS.ADMIN, remove: ACCESS.ADMIN },
    // 403: examen de otro paciente.
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
    // 404: cita inexistente; 409: cita no completada o ya reseñada; 403: cita de otro paciente.
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

// Documento final que lee Swagger UI.
module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'MediCita API',
    version: '1.0.0',
    description:
      'API REST de la plataforma de citas medicas MediCita. Para probar los endpoints protegidos, ' +
      'crea una sesion en POST /sessions y pega el token en el boton Authorize.',
  },
  // Prefijo común de todas las rutas.
  servers: [{ url: API_BASE_PATH }],
  // Orden de los grupos en la página: sesiones, cada recurso y reportes.
  tags: [{ name: 'Sessions' }, ...resources.map(({ tag }) => ({ name: tag })), { name: 'Reports' }],
  // Une en un solo objeto las rutas de sesión, de cada recurso y de los reportes.
  paths: Object.assign(buildSessionPath(), ...resources.map(buildCrudPaths), ...reports.map(buildReportPath)),
  components: { schemas, responses, securitySchemes },
};
