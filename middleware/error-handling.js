import { StatusCodes } from "http-status-codes";

const errorHandlingMiddleware = (err,res,req,next) => {
  const msg = err.msg || 'Something went Wrong. Please try again later'
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  
  res.status(statusCode).json({error:msg})
};