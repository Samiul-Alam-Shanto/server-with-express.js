import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;
  //1. check if the user exists
  // 2. compare the password
  // 3. generate token

  const userData = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
    `,
    [email],
  );
  if (userData.rows[0].length === 0) {
    throw new Error("Invalid Credentials");
  }
  const user = userData.rows[0];
  const matchPassword = await bcrypt.compare(password, user.password);
  //   console.log(matchPassword);
  if (!matchPassword) {
    throw new Error("Invalid Credentials");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
    is_active: user.is_active,
  };

  const accessToken = jwt.sign(jwtPayload, config.secret as string, {
    expiresIn: "1d",
  });
  const refreshToken = jwt.sign(jwtPayload, config.refresh_secret as string, {
    expiresIn: "10d",
  });
  return { accessToken, refreshToken };
};

const generateRefreshToken = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized");
  }

  const decodedToken = jwt.verify(
    token as string,
    config.refresh_secret as string,
  ) as JwtPayload;

  const userData = await pool.query(
    `
        
        SELECT * FROM users WHERE email=$1`,
    [decodedToken.email],
  );

  const user = userData.rows[0];

  if (userData.rows[0].length === 0) {
    throw new Error("User Not Found");
  }
  if (!user.is_active) {
    throw new Error("Forbidden");
  }
  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
    is_active: user.is_active,
  };

  const accessToken = jwt.sign(jwtPayload, config.secret as string, {
    expiresIn: "1d",
  });

  return accessToken;
};

export const authService = {
  loginUserIntoDB,
  generateRefreshToken,
};
