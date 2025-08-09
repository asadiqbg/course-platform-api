import { CustomAPIError } from "./custom-error.js";
import { StatusCodes } from "http-status-codes";

export default class NotFoundError extends CustomAPIError {
  constructor(msg){
    super(msg)
    this.statusCode = StatusCodes.NOT_FOUND
  }
}