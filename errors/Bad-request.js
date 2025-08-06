import { CustomAPIError } from "./custom-error.js";
import { StatusCodes } from 'http-status-codes';

export default class BadRequestError extends CustomAPIError {
  constructor(msg) {
    super(msg);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}