const { HTTP_STATUS } = require('../env/constants');

class SessionController {
  constructor(sessionService) {
    this.sessionService = sessionService;
  }

  create = async (request, response) => {
    const session = await this.sessionService.create(request.body);
    response.status(HTTP_STATUS.CREATED).json(session);
  };
}

module.exports = SessionController;
