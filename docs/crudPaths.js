const { HTTP_STATUS } = require('../env/constants');

const ACCESS_LEVELS = {
  PUBLIC: 'public',
  AUTHENTICATED: 'authenticated',
  ADMIN: 'admin',
  SELF_OR_ADMIN: 'selfOrAdmin',
};

const ERROR_RESPONSES = {
  [HTTP_STATUS.BAD_REQUEST]: 'BadRequest',
  [HTTP_STATUS.UNAUTHORIZED]: 'Unauthorized',
  [HTTP_STATUS.FORBIDDEN]: 'Forbidden',
  [HTTP_STATUS.NOT_FOUND]: 'NotFound',
  [HTTP_STATUS.CONFLICT]: 'Conflict',
};

const ACCESS_DESCRIPTIONS = {
  [ACCESS_LEVELS.PUBLIC]: 'Acceso publico.',
  [ACCESS_LEVELS.AUTHENTICATED]: 'Requiere token de cualquier rol.',
  [ACCESS_LEVELS.ADMIN]: 'Requiere token con rol admin.',
  [ACCESS_LEVELS.SELF_OR_ADMIN]: 'Requiere token del propio paciente o de un admin.',
};

const idParameter = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'integer', minimum: 1 },
  example: 1,
};

function schemaReference(name) {
  return { $ref: `#/components/schemas/${name}` };
}

function jsonContent(schema) {
  return { 'application/json': { schema } };
}

function buildErrorResponses(statusCodes) {
  return Object.fromEntries(
    statusCodes.map((statusCode) => [
      statusCode,
      { $ref: `#/components/responses/${ERROR_RESPONSES[statusCode]}` },
    ]),
  );
}

function authErrorCodes(accessLevel) {
  if (accessLevel === ACCESS_LEVELS.PUBLIC) {
    return [];
  }
  if (accessLevel === ACCESS_LEVELS.AUTHENTICATED) {
    return [HTTP_STATUS.UNAUTHORIZED];
  }
  return [HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN];
}

function buildQueryParameters(queryParameters) {
  return queryParameters.map(({ name, schema, example }) => ({
    name,
    in: 'query',
    required: false,
    schema,
    example,
  }));
}

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
  const allErrorCodes = [...errorCodes, ...authErrorCodes(accessLevel)].sort();
  return {
    tags: [tag],
    summary,
    description: ACCESS_DESCRIPTIONS[accessLevel],
    ...(accessLevel !== ACCESS_LEVELS.PUBLIC && { security: [{ bearerAuth: [] }] }),
    ...(hasIdParameter && { parameters: [idParameter] }),
    ...(queryParameters.length > 0 && { parameters: buildQueryParameters(queryParameters) }),
    ...(requestSchema && {
      requestBody: { required: true, content: jsonContent(schemaReference(requestSchema)) },
    }),
    responses: { ...successResponse, ...buildErrorResponses(allErrorCodes) },
  };
}

function buildSuccessResponse(statusCode, description, schema, headers) {
  return {
    [statusCode]: {
      description,
      ...(headers && { headers }),
      ...(schema && { content: jsonContent(schema) }),
    },
  };
}

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
  const accessFor = (operation) => access[operation] ?? ACCESS_LEVELS.AUTHENTICATED;
  const record = schemaReference(schemaName);
  const { BAD_REQUEST, NOT_FOUND } = HTTP_STATUS;

  return {
    [path]: {
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
        errorCodes: listParameters.length > 0 ? [BAD_REQUEST] : [],
      }),
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
      get: buildOperation({
        tag,
        accessLevel: accessFor('get'),
        summary: `Consultar ${label} por id`,
        hasIdParameter: true,
        successResponse: buildSuccessResponse(HTTP_STATUS.OK, label, record),
        errorCodes: [BAD_REQUEST, NOT_FOUND, ...(extraErrors.get ?? [])],
      }),
      patch: buildOperation({
        tag,
        accessLevel: accessFor('update'),
        summary: `Actualizar parcialmente un ${label}`,
        hasIdParameter: true,
        requestSchema: `${schemaName}Update`,
        successResponse: buildSuccessResponse(HTTP_STATUS.OK, `${label} actualizado`, record),
        errorCodes: [BAD_REQUEST, NOT_FOUND, ...(extraErrors.update ?? [])],
      }),
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

const ACCESS = ACCESS_LEVELS;

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
        description,
      },
    },
  };
}

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
