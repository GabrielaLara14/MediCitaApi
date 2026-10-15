// Error propio que lleva el código HTTP que se debe responder y, opcionalmente, el detalle por campo.
class HttpError extends Error {
  constructor(statusCode, message, details = []) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

module.exports = HttpError;
