import { NextFunction, Request, Response } from "express";
import { UserPayload } from "../helpers/UserPayload.helper";
import { NotAuthorizedError } from "../errors/NotAuthorizedError.error";
import { BadRequestError } from "../errors/BadRequestError.error";
import { verifyToken } from "../helpers/verifyToken.helpers";
import { generateToken } from "../helpers/generateToken";
import { AccessDeniedError } from "../errors/AccessDeniedError.error";

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers["authorization"]) {
    throw new NotAuthorizedError();
  }

  if (!req.headers["x-refresh-token"]) {
    throw new NotAuthorizedError();
  }

  const authorizationHeader = req.headers["authorization"] as string;
  
  const accessToken = authorizationHeader.split(" ")[1];
  const refreshToken = req.headers["x-refresh-token"] as string;

  if (!accessToken && !refreshToken) {
    throw new NotAuthorizedError();
  }

  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    throw new BadRequestError("Access and refresh token secrets must be set")
  }

  try {

    const decodedToken = await verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decodedToken;

    next();

  } catch (err) {
    if (refreshToken) {
      try {
        const decodedToken = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateToken(decodedToken);

        res.setHeader(
          "Authorization",
          `Bearer: ${JSON.stringify(newAccessToken)}`
        );

        res.setHeader(
          "X-Refresh-Token",
          newRefreshToken
        );

        req.user = decodedToken;

        next();

      } catch (err) {
        throw new NotAuthorizedError();
  
      }
    } else {
      throw new AccessDeniedError("Not enough permissions");
    }
  }
}