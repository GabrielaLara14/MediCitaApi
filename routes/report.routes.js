const { Router } = require('express');
const ReportController = require('../controllers/report.controller');
const { adminAccess } = require('../middlewares/accessRules');
const { validateQuery } = require('../middlewares/validateRequest');
const { incomeReportService, reviewStatisticsService } = require('../services/index');
const asyncHandler = require('../utils/asyncHandler');
const reportValidator = require('../validators/reportValidator');

const router = Router();

router.get(
  '/income-reports',
  ...adminAccess,
  validateQuery(reportValidator.income),
  asyncHandler(new ReportController(incomeReportService).generate),
);
router.get(
  '/review-statistics',
  ...adminAccess,
  validateQuery(reportValidator.reviewStatistics),
  asyncHandler(new ReportController(reviewStatisticsService).generate),
);

module.exports = router;
