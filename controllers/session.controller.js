// Controlador de sesiones: recibe las credenciales y responde con el token generado.
const { HTTP_STATUS } = require('../env/constants');

class SessionController {
  constructor(sessionService) {
    this.sessionService = sessionService;
  }

  // Responde 201 con la sesión creada (token y datos del usuario).
  create = async (request, response) => {
    const session = await this.sessionService.create(request.body);
    response.status(HTTP_STATUS.CREATED).json(session);
  };
}

module.exports = SessionController;
