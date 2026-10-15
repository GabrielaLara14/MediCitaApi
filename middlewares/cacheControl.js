// Indica al navegador que puede guardar la respuesta en caché durante el tiempo configurado.
const { env } = require('../env/config');

// "private" evita que la guarden cachés compartidas; max-age viene de CATALOG_CACHE_SECONDS.
function cacheCatalog(_request, response, next) {
  response.set('Cache-Control', `private, max-age=${env.catalogCacheSeconds}`);
  next();
}

module.exports = { cacheCatalog };
