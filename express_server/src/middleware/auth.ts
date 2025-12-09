// higher order function. Returning function
import config from '../config';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// roles = ["admin", "customer"]
const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: "You are not allowed!!" });
      }
      
      const token = authHeader.substring(7); // Remove "Bearer " prefix
      const decoded = jwt.verify(
        token,
        config.jwtSecret as string
      ) as JwtPayload;
      console.log({ decoded });
      req.user = decoded;

      // Check roles if specified
      if (roles.length && !roles.includes(decoded.role as string)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden"
        });
      }

      next();
    } catch (err: any) {
      res.status(401).json({
        success: false,
        message: err.message,
      });
    }
  };
};

export default auth;

