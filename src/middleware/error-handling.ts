import { StatusCodes } from "http-status-codes";
import { Req, Res, Next } from '../types/aliases';

const errorHandlingMiddleware = (err: any, req: Req, res: Res, next: Next) => {
  const msg = err.message || 'Something went Wrong. Please try again later';
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  
  res.status(statusCode).json({ error: msg });
};

export default errorHandlingMiddleware;