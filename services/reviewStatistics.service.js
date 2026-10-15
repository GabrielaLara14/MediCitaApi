const { MONEY_DECIMALS, RATING_RANGE } = require('../env/constants');

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

  async generate({ doctorId }) {
    const ratingCounts = await this.reviewDao.countByRating(doctorId);
    const distribution = createEmptyDistribution();
    ratingCounts.forEach(({ rating, total }) => {
      distribution[rating] = total;
    });

    const totalReviews = Object.values(distribution).reduce((sum, count) => sum + count, 0);
    const ratingSum = Object.entries(distribution).reduce(
      (sum, [rating, count]) => sum + Number(rating) * count,
      0,
    );
    const averageRating = totalReviews === 0 ? 0 : Number((ratingSum / totalReviews).toFixed(MONEY_DECIMALS));

    return { totalReviews, averageRating, distribution };
  }
}

module.exports = ReviewStatisticsService;
