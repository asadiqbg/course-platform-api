import { CustomAPIError } from "./custom-error";
import  StatusCodes from 'http-status-codes'

class BadRequestError extends CustomAPIError {
  constructor(statusCode,msg){
    super(msg)
    this.statusCode = StatusCodes.BAD_REQUEST
  }
}