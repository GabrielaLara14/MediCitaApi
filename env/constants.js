// Valores fijos compartidos por toda la API, para no repetir "números mágicos" ni textos.

// Ruta base de la API, ruta de Swagger y código de salida cuando el arranque falla.
const API_BASE_PATH = '/api';
const EXIT_CODE_FAILURE = 1;
const DOCS_PATH = '/api-docs';

// Códigos de estado HTTP usados en las respuestas.
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// Roles que pueden iniciar sesión.
const ROLES = {
  ADMIN: 'admin',
  PATIENT: 'patient',
};

// Estados posibles de una cita (coinciden con los valores guardados en la base de datos).
const APPOINTMENT_STATUS = {
  SCHEDULED: 'programada',
  COMPLETED: 'completada',
  CANCELLED: 'cancelada',
};

// Tipos de examen médico admitidos.
const EXAM_TYPES = {
  QUANTITATIVE: 'cuantitativo',
  QUALITATIVE: 'cualitativo',
  IMAGING: 'imagen',
};

// Códigos de error que devuelve MySQL y que la API traduce a respuestas HTTP.
const MYSQL_ERRORS = {
  DUPLICATE_ENTRY: 'ER_DUP_ENTRY',
  MISSING_REFERENCE: 'ER_NO_REFERENCED_ROW_2',
  REFERENCED_ROW: 'ER_ROW_IS_REFERENCED_2',
};

// Longitudes máximas (y mínimas cuando aplica) de los campos de texto, alineadas con la base de datos.
const FIELD_LENGTH = {
  NAME: { MIN: 2, MAX: 100 },
  EMAIL: 150,
  PHONE: { MIN: 7, MAX: 30 },
  PASSWORD: { MIN: 8, MAX: 72 },
  SPECIALTY: 100,
  SEARCH_TERM: 100,
  SCHEDULE: 100,
  BIOGRAPHY: 5000,
  REFERENCE_RANGE: 50,
  QUALITATIVE_RESULT: 100,
  IMAGE_REPORT: 5000,
  IMAGE_URL: 255,
  COMMENT: 5000,
  TAG: 30,
};

// Límites de negocio y formatos de validación.
const MAX_MONEY_VALUE = 99999999.99; // Mayor monto que cabe en una columna DECIMAL(10,2).
const MAX_TAGS_PER_REVIEW = 10; // Etiquetas permitidas por reseña.
const MAX_WAIT_MINUTES = 1440; // Espera máxima: un día completo en minutos.
const RATING_RANGE = { MIN: 1, MAX: 5 }; // Calificación de reseñas.
const PHONE_PATTERN = /^[0-9+\-\s()]+$/; // Solo dígitos, +, -, espacios y paréntesis.
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/; // Fecha AAAA-MM-DD.
const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/; // Mes AAAA-MM (01 a 12).
const MONEY_DECIMALS = 2; // Decimales de los valores en dinero.

module.exports = {
  EXIT_CODE_FAILURE,
  API_BASE_PATH,
  DOCS_PATH,
  HTTP_STATUS,
  ROLES,
  APPOINTMENT_STATUS,
  EXAM_TYPES,
  MYSQL_ERRORS,
  FIELD_LENGTH,
  MAX_MONEY_VALUE,
  MAX_TAGS_PER_REVIEW,
  MAX_WAIT_MINUTES,
  RATING_RANGE,
  PHONE_PATTERN,
  DATE_ONLY_PATTERN,
  MONTH_PATTERN,
  MONEY_DECIMALS,
};
