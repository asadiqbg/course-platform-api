import { StatusCodes } from "http-status-codes";

const errorHandlingMiddleware = (err, req, res, next) => {
  const msg = err.message || 'Something went Wrong. Please try again later';
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  
  res.status(statusCode).json({ error: msg });
};

export default errorHandlingMiddleware;