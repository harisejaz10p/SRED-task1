import { EXTERNAL_AUTH_BASE_URL, EXTERNAL_AUTH_GITHUB_CALLBACK_URL, GITHUB_CALLBACK_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_IDENTITY_URL, GITHUB_TOKEN_URL } from "../constants/constants";
import { getGithubOAuthUrl } from "../helpers/url";
import { Request, Response } from 'express';
import { GithubUserSchema } from "../models/github-user.model";
import { fetchData } from "../helpers/fetch";

/**
 * Controller for handling external authentication requests.
 */
class ExternalAuthController {

    public authenticate(req: Request, res: Response): void {
        const redirectUri = `${GITHUB_CALLBACK_URL}${EXTERNAL_AUTH_BASE_URL}${EXTERNAL_AUTH_GITHUB_CALLBACK_URL}`;
        const githubAuthUrl = getGithubOAuthUrl(GITHUB_CLIENT_ID, redirectUri);
        res.json({
            url: githubAuthUrl
        });
    }

    public async removeIntegration(req: Request, res: Response): Promise<void> {
        try {
            const accessToken = parseAuthHeader(req)
            if (!accessToken) {
                res.status(401).json({ message: 'Missing access token' });
                return;
            }

            await GithubUserSchema.deleteMany({ accessToken });
            res.json({ message: `Integration for user removed successfully.` });

        } catch (error) {
            console.error('Error removing GitHub integration:', error);
            res.status(500).send('Error removing integration');
        }
    }

    public async getStatus(req: Request, res: Response): Promise<void> {
        try {
            const accessToken = parseAuthHeader(req);
            if (!accessToken) {
                res.status(401).json({ message: 'Missing access token' });
                return;
            }

            const githubUserData = await fetchData<IGithubUserResponse>(GITHUB_IDENTITY_URL, 'GET', null, {
                Authorization: `Bearer ${accessToken}`
            });

            const githubUsername = githubUserData?.login;
            if (!githubUsername) {
                res.status(401).json({ message: 'Invalid access token or unable to fetch GitHub user data' });
                return;
            }

            const storedUser = await GithubUserSchema.findOne({ username: githubUsername });
            if (!storedUser) {
                res.status(404).json({ message: 'No matching user found in the system' });
                return;
            }

            res.json({
                connected: true,
                username: storedUser.username,
                connectedAt: storedUser.createdAt
            });
        } catch (error) {
            // Return 401 if GitHub API returns 401
            res.status(401).json({ message: 'Invalid or expired access token' });
        }
    }

    public async callback(req: Request, res: Response): Promise<void> {
        const { code } = req.query;

        try {
            if (!code) {
                res.status(400).send('Missing authorization code');
                return;
            }
            const tokenResponse = await fetchData<{ access_token: string }>(GITHUB_TOKEN_URL, 'POST', {
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code
            });

            const accessToken = tokenResponse?.access_token;
            if (!accessToken) {
                res.status(401).json({ message: 'Failed to obtain access token' });
                return;
            }

            const githubUserData = await fetchData<IGithubUserResponse>(GITHUB_IDENTITY_URL, 'GET', null, {
                Authorization: `Bearer ${accessToken}`
            });

            const githubUsername = githubUserData?.login;
            if (!githubUsername) {
                res.status(401).json({ message: 'Invalid access token or unable to fetch GitHub user data' });
                return;
            }
            const redirectUrl = `http://localhost:4200/oauth/callback?access_token=${accessToken}`;

            const existingUser = await GithubUserSchema.findOne({ username: githubUsername });
            if (existingUser) {
                res.redirect(redirectUrl);
                return;
            }

            const newUser = new GithubUserSchema({
                username: githubUsername,
                avatarUrl: githubUserData.avatar_url ?? '',
                email: githubUserData.email ?? '',
                id: githubUserData.id,
                accessToken
            });
            await newUser.save();

        } catch (error) {
            console.error('Error during OAuth callback:', error);
            res.status(500).send('Error during GitHub OAuth callback');
        }
    }
}

/**
 * Export an instance of the ExternalAuthController
 */
export default new ExternalAuthController();

//#region Internal
/////////////////////////////////////////////////////////////

interface IGithubUserResponse {
    readonly login: string;
    readonly avatar_url: string;
    readonly email: string;
    readonly id: number;
    readonly accessToken: string;
}

function parseAuthHeader(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }
    return null;
}

/////////////////////////////////////////////////////////////
//#endregion
