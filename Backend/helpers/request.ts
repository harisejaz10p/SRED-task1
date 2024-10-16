
import { Request, Response } from 'express';

/**
 * Parse the Authorization header and return the token
 * @param req - Request object
 * @returns - Token from the Authorization header
 */
export function parseAuthHeader(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }
    return null;
}