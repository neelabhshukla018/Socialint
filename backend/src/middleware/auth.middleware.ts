import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";

import { db } from "../prisma/db.js";

export interface AuthenticatedRequest extends Request {
  userId?: number;
  clerkUserId?: string;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { isAuthenticated, userId: clerkUserId } =
      getAuth(req);

    if (!isAuthenticated || !clerkUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please sign in.",
      });
    }

    /*
     * Find our database User using the
     * Clerk user ID.
     */
    const user = await db.orm.public.User.first({
      clerkId: clerkUserId,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "User account was not found in SocialIntel.",
      });
    }

    req.clerkUserId = clerkUserId;
    req.userId = user.id;

    next();
  } catch (error) {
    console.error(
      "Authentication middleware error:",
      error
    );

    return res.status(401).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};