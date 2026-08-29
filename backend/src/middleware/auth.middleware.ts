import type { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  userId?: number;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.headers["x-user-id"];

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. x-user-id header is required.",
    });
  }

  const parsedUserId = Number(userId);

  if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid x-user-id.",
    });
  }

  req.userId = parsedUserId;

  next();
};