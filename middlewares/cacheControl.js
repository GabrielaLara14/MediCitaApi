const { env } = require('../env/config');

function cacheCatalog(_request, response, next) {
  response.set('Cache-Control', `private, max-age=${env.catalogCacheSeconds}`);
  next();
}

module.exports = { cacheCatalog };
