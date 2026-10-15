class ReportController {
  constructor(service) {
    this.service = service;
  }

  generate = async (request, response) => {
    response.json(await this.service.generate(request.filters));
  };
}

module.exports = ReportController;
