// Estadísticas de reseñas: total, promedio y cuántas hay de cada calificación.
const { MONEY_DECIMALS, RATING_RANGE } = require('../env/constants');

// Crea un objeto {1: 0, 2: 0, ... 5: 0} para que aparezcan todas las calificaciones, incluso las sin reseñas.
function createEmptyDistribution() {
  const distribution = {};
  for (let rating = RATING_RANGE.MIN; rating <= RATING_RANGE.MAX; rating += 1) {
    distribution[rating] = 0;
  }
  return distribution;
}

class ReviewStatisticsService {
  constructor(reviewDao) {
    this.reviewDao = reviewDao;
  }

  // doctorId es opcional: si se envía, solo cuenta las reseñas de ese médico.
  async generate({ doctorId }) {
    const ratingCounts = await this.reviewDao.countByRating(doctorId);
    const distribution = createEmptyDistribution();
    // Rellena la distribución con los conteos que devolvió la base de datos.
    ratingCounts.forEach(({ rating, total }) => {
      distribution[rating] = total;
    });

    // Total de reseñas = suma de los conteos de cada calificación.
    const totalReviews = Object.values(distribution).reduce((sum, count) => sum + count, 0);
    // Suma ponderada: cada calificación multiplicada por la cantidad de veces que se dio.
    const ratingSum = Object.entries(distribution).reduce(
      (sum, [rating, count]) => sum + Number(rating) * count,
      0,
    );
    // Promedio con 2 decimales; si no hay reseñas devuelve 0 para evitar dividir entre cero.
    const averageRating = totalReviews === 0 ? 0 : Number((ratingSum / totalReviews).toFixed(MONEY_DECIMALS));

    return { totalReviews, averageRating, distribution };
  }
}

module.exports = ReviewStatisticsService;
