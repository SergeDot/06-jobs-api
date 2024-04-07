import { CustomAPIError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';
const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  };
  if (err.name === 'ValidationError') {
    const errorMessage = Object.values(err.errors).map(val => val.message);
    return res.status(err.statusCode).json({ msg: errorMessage.join(', ') })
  };
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.name, msg: err.message })
};

export default errorHandlerMiddleware;
