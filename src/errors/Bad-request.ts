import CustomAPIError from './custom-error'
import { StatusCodes } from 'http-status-codes'

export default class BadRequestError extends CustomAPIError{
  details?:unknown
  constructor(message:string,details?:unknown){
    super(message,StatusCodes.BAD_REQUEST)
    this.details = details;
  }
}