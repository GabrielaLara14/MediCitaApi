// Controlador de reportes: pide al servicio generar el reporte con los filtros recibidos.
class ReportController {
  constructor(service) {
    this.service = service;
  }

  generate = async (request, response) => {
    response.json(await this.service.generate(request.filters));
  };
}

module.exports = ReportController;
