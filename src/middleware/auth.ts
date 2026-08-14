import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { UserRole } from "../modules/user/user.interface";

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log(roles);
    try {
      // console.log(req.headers.authorization);
      const token = req.headers.authorization;
      if (!token) {
        res.status(401).json({
          success: false,
          message: "Unauthorized Access !!",
        });
      }

      const decodedToken = jwt.verify(
        token as string,
        config.secret as string,
      ) as JwtPayload;
      // console.log(decodedToken);

      const userData = await pool.query(
        `
        
        SELECT * FROM users WHERE email=$1`,
        [decodedToken.email],
      );
      // console.log(userData);
      const user = userData.rows[0];
      // console.log(user);
      if (userData.rows[0].length === 0) {
        res.status(404).json({
          success: false,
          message: "User Not Found",
        });
      }
      if (!user.is_active) {
        res.status(403).json({
          success: false,
          message: "Forbidden",
        });
      }
      // console.log("auth role",user.role);
      if (roles.length && !roles.includes(user.role)) {
        res.status(403).json({
          success: false,
          message: "Forbidden",
        });
      }

      req.user = decodedToken;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
