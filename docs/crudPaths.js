// Generadores de las rutas del documento OpenAPI: arman automáticamente la documentación de cada endpoint.
const { HTTP_STATUS } = require('../env/constants');

// Niveles de acceso que se pueden documentar.
const ACCESS_LEVELS = {
  PUBLIC: 'public',
  AUTHENTICATED: 'authenticated',
  ADMIN: 'admin',
  SELF_OR_ADMIN: 'selfOrAdmin',
};

// Código de error HTTP -> nombre de la respuesta reutilizable en components.js.
const ERROR_RESPONSES = {
  [HTTP_STATUS.BAD_REQUEST]: 'BadRequest',
  [HTTP_STATUS.UNAUTHORIZED]: 'Unauthorized',
  [HTTP_STATUS.FORBIDDEN]: 'Forbidden',
  [HTTP_STATUS.NOT_FOUND]: 'NotFound',
  [HTTP_STATUS.CONFLICT]: 'Conflict',
};

// Texto que se muestra en Swagger para cada nivel de acceso.
const ACCESS_DESCRIPTIONS = {
  [ACCESS_LEVELS.PUBLIC]: 'Acceso publico.',
  [ACCESS_LEVELS.AUTHENTICATED]: 'Requiere token de cualquier rol.',
  [ACCESS_LEVELS.ADMIN]: 'Requiere token con rol admin.',
  [ACCESS_LEVELS.SELF_OR_ADMIN]: 'Requiere token del propio paciente o de un admin.',
};

// Parámetro :id de la ruta, común a consultar, actualizar y eliminar.
const idParameter = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'integer', minimum: 1 },
  example: 1,
};

// Referencia a un esquema definido en components.js.
function schemaReference(name) {
  return { $ref: `#/components/schemas/${name}` };
}

// Contenido JSON con el esquema dado.
function jsonContent(schema) {
  return { 'application/json': { schema } };
}

// Convierte una lista de códigos de error en referencias a las respuestas reutilizables.
function buildErrorResponses(statusCodes) {
  return Object.fromEntries(
    statusCodes.map((statusCode) => [
      statusCode,
      { $ref: `#/components/responses/${ERROR_RESPONSES[statusCode]}` },
    ]),
  );
}

// Errores de autenticación que corresponden a un nivel de acceso: ninguno si es público,
// 401 si basta con un token, y 401 más 403 si además se exige un rol o ser el dueño.
function authErrorCodes(accessLevel) {
  if (accessLevel === ACCESS_LEVELS.PUBLIC) {
    return [];
  }
  if (accessLevel === ACCESS_LEVELS.AUTHENTICATED) {
    return [HTTP_STATUS.UNAUTHORIZED];
  }
  return [HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN];
}

// Documenta los parámetros de consulta (?campo=valor) como opcionales.
function buildQueryParameters(queryParameters) {
  return queryParameters.map(({ name, schema, example }) => ({
    name,
    in: 'query',
    required: false,
    schema,
    example,
  }));
}

// Arma la documentación de una operación (por ejemplo, GET /doctors): etiqueta, acceso, parámetros, cuerpo y respuestas.
function buildOperation({
  tag,
  accessLevel,
  summary,
  successResponse,
  errorCodes,
  requestSchema,
  hasIdParameter,
  queryParameters = [],
}) {
  // Une los errores propios de la operación con los de autenticación, y los ordena por código.
  const allErrorCodes = [...errorCodes, ...authErrorCodes(accessLevel)].sort();
  return {
    tags: [tag],
    summary,
    description: ACCESS_DESCRIPTIONS[accessLevel],
    // Solo las operaciones no públicas piden token (candado en Swagger).
    ...(accessLevel !== ACCESS_LEVELS.PUBLIC && { security: [{ bearerAuth: [] }] }),
    ...(hasIdParameter && { parameters: [idParameter] }),
    ...(queryParameters.length > 0 && { parameters: buildQueryParameters(queryParameters) }),
    // Cuerpo de la solicitud, solo cuando la operación recibe datos (crear y actualizar).
    ...(requestSchema && {
      requestBody: { required: true, content: jsonContent(schemaReference(requestSchema)) },
    }),
    responses: { ...successResponse, ...buildErrorResponses(allErrorCodes) },
  };
}

// Respuesta exitosa: código, descripción y, si aplica, esquema del cuerpo y encabezados.
function buildSuccessResponse(statusCode, description, schema, headers) {
  return {
    [statusCode]: {
      description,
      ...(headers && { headers }),
      ...(schema && { content: jsonContent(schema) }),
    },
  };
}

// Genera las cinco operaciones CRUD de un recurso, en dos rutas: /recurso y /recurso/{id}.
function buildCrudPaths({
  tag,
  path,
  label,
  schemaName,
  pluralLabel = `${label}s`,
  access = {},
  extraErrors = {},
  listParameters = [],
  listHeaders,
}) {
  // Nivel de acceso de la operación; si no se indicó, basta con estar autenticado.
  const accessFor = (operation) => access[operation] ?? ACCESS_LEVELS.AUTHENTICATED;
  const record = schemaReference(schemaName);
  const { BAD_REQUEST, NOT_FOUND } = HTTP_STATUS;

  return {
    [path]: {
      // Listar (200 con un arreglo de registros).
      get: buildOperation({
        tag,
        accessLevel: accessFor('list'),
        summary: `Listar ${pluralLabel}`,
        queryParameters: listParameters,
        successResponse: buildSuccessResponse(
          HTTP_STATUS.OK,
          `Lista de ${pluralLabel}`,
          { type: 'array', items: record },
          listHeaders,
        ),
        // 400 solo si el listado admite filtros que puedan venir mal escritos.
        errorCodes: listParameters.length > 0 ? [BAD_REQUEST] : [],
      }),
      // Crear (201 con el registro creado).
      post: buildOperation({
        tag,
        accessLevel: accessFor('create'),
        summary: `Crear ${label}`,
        requestSchema: `${schemaName}Input`,
        successResponse: buildSuccessResponse(HTTP_STATUS.CREATED, `${label} creado`, record),
        errorCodes: [BAD_REQUEST, ...(extraErrors.create ?? [])],
      }),
    },
    [`${path}/{id}`]: {
      // Consultar por id.
      get: buildOperation({
        tag,
        accessLevel: accessFor('get'),
        summary: `Consultar ${label} por id`,
        hasIdParameter: true,
        successResponse: buildSuccessResponse(HTTP_STATUS.OK, label, record),
        errorCodes: [BAD_REQUEST, NOT_FOUND, ...(extraErrors.get ?? [])],
      }),
      // Actualizar parcialmente: solo se envían los campos que cambian.
      patch: buildOperation({
        tag,
        accessLevel: accessFor('update'),
        summary: `Actualizar parcialmente un ${label}`,
        hasIdParameter: true,
        requestSchema: `${schemaName}Update`,
        successResponse: buildSuccessResponse(HTTP_STATUS.OK, `${label} actualizado`, record),
        errorCodes: [BAD_REQUEST, NOT_FOUND, ...(extraErrors.update ?? [])],
      }),
      // Eliminar (204 sin cuerpo).
      delete: buildOperation({
        tag,
        accessLevel: accessFor('remove'),
        summary: `Eliminar ${label}`,
        hasIdParameter: true,
        successResponse: buildSuccessResponse(HTTP_STATUS.NO_CONTENT, `${label} eliminado`),
        errorCodes: [BAD_REQUEST, NOT_FOUND, ...(extraErrors.remove ?? [])],
      }),
    },
  };
}

// Alias corto para que otros archivos usen ACCESS.ADMIN, ACCESS.PUBLIC, etc.
const ACCESS = ACCESS_LEVELS;

// Documenta un reporte: una ruta GET solo para administradores con su propia descripción.
function buildReportPath({ path, tag, summary, description, queryParameters, responseSchema }) {
  return {
    [path]: {
      get: {
        ...buildOperation({
          tag,
          accessLevel: ACCESS_LEVELS.ADMIN,
          summary,
          queryParameters,
          successResponse: buildSuccessResponse(HTTP_STATUS.OK, summary, schemaReference(responseSchema)),
          errorCodes: [HTTP_STATUS.BAD_REQUEST],
        }),
        // Reemplaza la descripción genérica de acceso por la específica del reporte.
        description,
      },
    },
  };
}

// Documenta POST /sessions (público): devuelve 201 con el token o 400/401 si falla.
function buildSessionPath() {
  return {
    '/sessions': {
      post: buildOperation({
        tag: 'Sessions',
        accessLevel: ACCESS_LEVELS.PUBLIC,
        summary: 'Iniciar sesion y obtener un token',
        requestSchema: 'SessionInput',
        successResponse: buildSuccessResponse(
          HTTP_STATUS.CREATED,
          'Sesion creada',
          schemaReference('Session'),
        ),
        errorCodes: [HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.UNAUTHORIZED],
      }),
    },
  };
}

module.exports = { buildCrudPaths, ACCESS, buildReportPath, buildSessionPath };
