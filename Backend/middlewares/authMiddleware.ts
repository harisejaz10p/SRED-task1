import { Request, Response, NextFunction } from "express";
import { parseAuthHeader } from "../helpers/request";

/**
 * Middleware for authenticating requests.
 * @param req - Request
 * @param res - Response
 * @param next - Next function
 */
export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const accessToken = parseAuthHeader(req);
    if (!accessToken) {
        res.status(401).json({ message: "Missing access token" });
        return;
    }
    //@ts-ignore
    req.accessToken = accessToken;
    next();
}
