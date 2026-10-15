const { APPOINTMENT_STATUS, EXAM_TYPES, RATING_RANGE, ROLES } = require('../env/constants');

const idProperty = { type: 'integer', example: 1, readOnly: true };

const accountProperties = {
  name: { type: 'string', example: 'Laura Gómez' },
  email: { type: 'string', format: 'email', example: 'laura.gomez@correo.com' },
};

const passwordProperty = {
  type: 'string',
  format: 'password',
  minLength: 8,
  maxLength: 72,
  example: 'Clave12345',
};

const patientProperties = {
  ...accountProperties,
  phone: { type: 'string', example: '3001234567' },
};

const doctorProperties = {
  name: { type: 'string', example: 'Dr. Carlos Rivera' },
  specialty: { type: 'string', example: 'Cardiología' },
  schedule: { type: 'string', example: 'Lunes a viernes 8:00 - 12:00' },
  consultationFee: { type: 'number', format: 'double', example: 120000 },
  biography: { type: 'string', example: 'Cardiólogo con 15 años de experiencia.' },
};

const examResultProperties = {
  numericValue: { type: 'number', example: 92.5 },
  referenceRange: { type: 'string', example: '70 - 100 mg/dL' },
  qualitativeResult: { type: 'string', example: 'Negativo' },
  imageReport: { type: 'string', example: 'Sin hallazgos patológicos.' },
  imageUrl: { type: 'string', format: 'uri', example: 'https://ejemplo.com/imagenes/rx-torax.png' },
};

const reviewProperties = {
  rating: {
    type: 'integer',
    minimum: RATING_RANGE.MIN,
    maximum: RATING_RANGE.MAX,
    example: 5,
  },
  comment: { type: 'string', example: 'Excelente atención.' },
  waitMinutes: { type: 'integer', minimum: 0, example: 10 },
  tags: { type: 'array', items: { type: 'string' }, example: ['puntual', 'amable'] },
};

const futureDateExample = '2027-03-15T14:30:00.000Z';

function withId(properties) {
  return { id: idProperty, ...properties };
}

function objectSchema(properties, required = []) {
  return { type: 'object', properties, ...(required.length > 0 && { required }) };
}

const schemas = {
  ErrorResponse: objectSchema({
    status: { type: 'integer', example: 400 },
    message: { type: 'string', example: 'Datos de entrada invalidos' },
    details: {
      type: 'array',
      items: objectSchema({
        field: { type: 'string', example: 'email' },
        message: { type: 'string', example: '"email" must be a valid email' },
      }),
    },
  }),
  SessionInput: objectSchema(
    {
      email: accountProperties.email,
      password: { type: 'string', format: 'password', example: 'Admin12345' },
      role: { type: 'string', enum: Object.values(ROLES), example: ROLES.ADMIN },
    },
    ['email', 'password', 'role'],
  ),
  Session: objectSchema({
    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
    tokenType: { type: 'string', example: 'Bearer' },
    expiresIn: { type: 'string', example: '2h' },
    userId: { type: 'integer', example: 1 },
    role: { type: 'string', enum: Object.values(ROLES) },
  }),
  Admin: objectSchema(withId(accountProperties)),
  AdminInput: objectSchema({ ...accountProperties, password: passwordProperty }, [
    'name',
    'email',
    'password',
  ]),
  AdminUpdate: objectSchema({ ...accountProperties, password: passwordProperty }),
  Patient: objectSchema(withId(patientProperties)),
  PatientInput: objectSchema({ ...patientProperties, password: passwordProperty }, [
    'name',
    'email',
    'phone',
    'password',
  ]),
  PatientUpdate: objectSchema({ ...patientProperties, password: passwordProperty }),
  Doctor: objectSchema(withId(doctorProperties)),
  DoctorInput: objectSchema(doctorProperties, ['name', 'specialty', 'schedule', 'consultationFee']),
  DoctorUpdate: objectSchema(doctorProperties),
  Appointment: objectSchema(
    withId({
      patientId: { type: 'integer', example: 1 },
      doctorId: { type: 'integer', example: 1 },
      scheduledAt: { type: 'string', format: 'date-time', example: futureDateExample },
      price: { type: 'number', example: 120000 },
      status: {
        type: 'string',
        enum: Object.values(APPOINTMENT_STATUS),
        example: APPOINTMENT_STATUS.SCHEDULED,
      },
    }),
  ),
  AppointmentInput: objectSchema(
    {
      patientId: { type: 'integer', example: 1 },
      doctorId: { type: 'integer', example: 1 },
      scheduledAt: { type: 'string', format: 'date-time', example: futureDateExample },
    },
    ['patientId', 'doctorId', 'scheduledAt'],
  ),
  AppointmentUpdate: objectSchema({
    scheduledAt: { type: 'string', format: 'date-time', example: futureDateExample },
    status: {
      type: 'string',
      enum: Object.values(APPOINTMENT_STATUS),
      example: APPOINTMENT_STATUS.COMPLETED,
    },
  }),
  Exam: objectSchema(
    withId({
      patientId: { type: 'integer', example: 1 },
      type: { type: 'string', enum: Object.values(EXAM_TYPES), example: EXAM_TYPES.QUANTITATIVE },
      ...examResultProperties,
    }),
  ),
  ExamInput: objectSchema(
    {
      patientId: { type: 'integer', example: 1 },
      type: { type: 'string', enum: Object.values(EXAM_TYPES), example: EXAM_TYPES.QUANTITATIVE },
      ...examResultProperties,
    },
    ['patientId', 'type'],
  ),
  ExamUpdate: objectSchema(examResultProperties),
  Review: objectSchema(
    withId({
      appointmentId: { type: 'integer', example: 2 },
      doctorId: { type: 'integer', example: 1 },
      ...reviewProperties,
    }),
  ),
  ReviewInput: objectSchema({ appointmentId: { type: 'integer', example: 2 }, ...reviewProperties }, [
    'appointmentId',
    'rating',
  ]),
  ReviewUpdate: objectSchema(reviewProperties),
  IncomeReport: objectSchema({
    period: objectSchema({
      from: { type: 'string', format: 'date-time', example: '2027-02-10T00:00:00.000Z' },
      to: { type: 'string', format: 'date-time', example: '2027-02-11T00:00:00.000Z' },
    }),
    totalAppointments: { type: 'integer', example: 1 },
    totalIncome: { type: 'number', example: 80000 },
    appointments: { type: 'array', items: { $ref: '#/components/schemas/Appointment' } },
  }),
  ReviewStatistics: objectSchema({
    totalReviews: { type: 'integer', example: 3 },
    averageRating: { type: 'number', example: 4.33 },
    distribution: objectSchema({
      1: { type: 'integer', example: 0 },
      2: { type: 'integer', example: 0 },
      3: { type: 'integer', example: 1 },
      4: { type: 'integer', example: 0 },
      5: { type: 'integer', example: 2 },
    }),
  }),
};

function errorResponse(description) {
  return {
    description,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
  };
}

const responses = {
  BadRequest: errorResponse('Datos de entrada invalidos o identificador mal formado'),
  Unauthorized: errorResponse('Token ausente, invalido o expirado, o credenciales incorrectas'),
  Forbidden: errorResponse(
    'El rol del usuario no tiene permiso para esta operacion o el registro pertenece a otro paciente',
  ),
  NotFound: errorResponse('El recurso solicitado no existe'),
  Conflict: errorResponse('La operacion entra en conflicto con el estado actual de los datos'),
};

const securitySchemes = {
  bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
};

module.exports = { schemas, responses, securitySchemes };
