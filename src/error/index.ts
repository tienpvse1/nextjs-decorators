import { StatusCodes } from 'http-status-codes';

class HttpError {
  message: string = '';
  code: number;
}

export class Forbidden extends HttpError {
  constructor(message: string = 'forbidden') {
    super();
    this.code = StatusCodes.FORBIDDEN;
    this.message = message;
  }
}
export class NotFound extends HttpError {
  constructor(message: string = 'not found') {
    super();
    this.code = StatusCodes.NOT_FOUND;
    this.message = message;
  }
}
export class Unauthorize extends HttpError {
  constructor(message: string = 'unauthorized') {
    super();
    this.code = StatusCodes.UNAUTHORIZED;
    this.message = message;
  }
}
export class InternalServerError extends HttpError {
  constructor(message: string = 'internal server error') {
    super();
    this.code = StatusCodes.INTERNAL_SERVER_ERROR;
    this.message = message;
  }
}
export class BadRequest extends HttpError {
  constructor(message: string = 'bad request') {
    super();
    this.code = StatusCodes.BAD_REQUEST;
    this.message = message;
  }
}
export class BadGateway extends HttpError {
  constructor(message: string = 'bad gateway') {
    super();
    this.code = StatusCodes.BAD_GATEWAY;
    this.message = message;
  }
}
export class RequestTimeout extends HttpError {
  constructor(message: string = 'request timeout') {
    super();
    this.code = StatusCodes.REQUEST_TIMEOUT;
    this.message = message;
  }
}
