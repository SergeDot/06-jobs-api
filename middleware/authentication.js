import jwt from 'jsonwebtoken';
import { UnauthenticatedError } from '../errors/index.js';

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication is invalid');
  };

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userID: payload.userID, name: payload.name };

    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication is invalid');
  };
};

export default auth;
