import { CustomAPIError } from "./custom-error";
import { StatusCodes } from "http-status-codes";

class UnauthenticatedError extends CustomAPIError {
  constructor(statusCode,msg){
    super(msg)
    this.statusCodes = StatusCodes.UNAUTHORIZED
  }
}