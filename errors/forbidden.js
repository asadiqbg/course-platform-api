import { CustomAPIError } from "./custom-error.js";
import { StatusCodes } from "http-status-codes";

export default class ForbiddenError extends CustomAPIError{
  constructor(msg){
    super(msg)
    this.statusCode = StatusCodes.FORBIDDEN
  }
}