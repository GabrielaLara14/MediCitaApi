const { Router } = require('express');
const SessionController = require('../controllers/session.controller');
const { validateBody } = require('../middlewares/validateRequest');
const { sessionService } = require('../services/index');
const asyncHandler = require('../utils/asyncHandler');
const sessionValidator = require('../validators/sessionValidator');

const sessionController = new SessionController(sessionService);
const router = Router();

router.post('/', validateBody(sessionValidator.create), asyncHandler(sessionController.create));

module.exports = router;
