// Punto de entrada de la API: arma la aplicación Express y la pone a escuchar.
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { API_BASE_PATH, DOCS_PATH, EXIT_CODE_FAILURE } = require('./env/constants');
const { env } = require('./env/config');
const openApiDocument = require('./docs/openApiDocument');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandlers');
const routes = require('./routes');
const db = require('./services/mysql.service');

const api = express();

// Convierte el cuerpo JSON de cada solicitud en un objeto en request.body.
api.use(express.json());
// Sirve los archivos estáticos de la carpeta public (página de inicio).
api.use(express.static('public'));
// Publica la documentación interactiva Swagger generada desde el documento OpenAPI.
api.use(DOCS_PATH, swaggerUi.serve, swaggerUi.setup(openApiDocument));
// Monta todas las rutas de la API bajo el prefijo /api.
api.use(API_BASE_PATH, routes);
// Estos dos van al final: responden 404 a rutas inexistentes y formatean cualquier error.
api.use(notFoundHandler);
api.use(errorHandler);

// Verifica que la base de datos responda y luego abre el puerto.
async function startServer() {
  // Consulta mínima: si MySQL no está disponible, falla antes de aceptar solicitudes.
  await db.query('SELECT 1');
  api.listen(env.port, () => {
    console.log(`MediCita API escuchando en http://localhost:${env.port}`);
  });
}

// Si el arranque falla (por ejemplo, sin conexión a MySQL), muestra el motivo y termina el proceso.
startServer().catch((error) => {
  console.error('No se pudo iniciar la API:', error.message);
  process.exit(EXIT_CODE_FAILURE);
});
