const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { API_BASE_PATH, DOCS_PATH, EXIT_CODE_FAILURE } = require('./env/constants');
const { env } = require('./env/config');
const openApiDocument = require('./docs/openApiDocument');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandlers');
const routes = require('./routes');
const db = require('./services/mysql.service');

const api = express();

api.use(express.json());
api.use(express.static('public'));
api.use(DOCS_PATH, swaggerUi.serve, swaggerUi.setup(openApiDocument));
api.use(API_BASE_PATH, routes);
api.use(notFoundHandler);
api.use(errorHandler);

async function startServer() {
  await db.query('SELECT 1');
  api.listen(env.port, () => {
    console.log(`MediCita API escuchando en http://localhost:${env.port}`);
  });
}

startServer().catch((error) => {
  console.error('No se pudo iniciar la API:', error.message);
  process.exit(EXIT_CODE_FAILURE);
});
