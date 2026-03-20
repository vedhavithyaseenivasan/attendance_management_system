import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayloadCustom {
  id: string;
  role: string;
}

//Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadCustom;
    }
  }
}

const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET not defined in environment");
    }

    const decoded = jwt.verify(token, secret) as JwtPayloadCustom;

    req.user = decoded;

    next();
  }
  catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authenticate;