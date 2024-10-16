import { EXTERNAL_AUTH_BASE_URL, EXTERNAL_AUTH_GITHUB_CALLBACK_URL, GITHUB_CALLBACK_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_IDENTITY_URL, GITHUB_TOKEN_URL } from "../constants/constants";
import { getCallbackUrlWithToken, getGithubOAuthUrl } from "../helpers/url";
import { Request, Response } from 'express';
import { GithubUserSchema } from "../models/github-user.model";
import { fetchData } from "../helpers/fetch";

/**
 * Controller for handling external authentication requests.
 */
class ExternalAuthController {

  /**
   * Authenticate user with GitHub.
   * @param req 
   * @param res 
   */
  public authenticate(req: Request, res: Response): void {
    const redirectUri = `${GITHUB_CALLBACK_URL}${EXTERNAL_AUTH_BASE_URL}${EXTERNAL_AUTH_GITHUB_CALLBACK_URL}`;
    const githubAuthUrl = getGithubOAuthUrl(GITHUB_CLIENT_ID, redirectUri);
    res.json({
      url: githubAuthUrl
    });
  }

  /**
   * Remove GitHub integration for user.
   * @param req - The request object.
   * @param res  - The response object.
   */
  public async removeIntegration(req: Request, res: Response): Promise<void> {
    try {
      //@ts-ignore
      const accessToken = req.accessToken;
      await GithubUserSchema.deleteMany({ accessToken });
      res.json({ message: `Integration for user removed successfully.` });

    } catch (error) {
      console.error('Error removing GitHub integration:', error);
      res.status(500).send('Error removing integration');
    }
  }

  /**
   * Get the status of the GitHub integration.
   * @param req - The request object.
   * @param res - The response object.
   */
  public async getStatus(req: Request, res: Response): Promise<void> {
    try {
      //@ts-ignore
      const accessToken = req.accessToken;
      const { data: githubUserData } = await fetchData<IGithubUserResponse>(GITHUB_IDENTITY_URL, 'GET', null, {
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

  /**
   * Callback for GitHub OAuth.
   * @param req - The request object.
   * @param res - The response object.
   * @returns 
   */
  public async callback(req: Request, res: Response): Promise<void> {
    const { code } = req.query;

    try {
      if (!code) {
        res.status(400).send('Missing authorization code');
        return;
      }
      const { data: tokenResponse } = await fetchData<{ access_token: string }>(GITHUB_TOKEN_URL, 'POST', {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code
      });

      const accessToken = tokenResponse?.access_token;
      if (!accessToken) {
        res.status(401).json({ message: 'Failed to obtain access token' });
        return;
      }

      const { data: githubUserData } = await fetchData<IGithubUserResponse>(GITHUB_IDENTITY_URL, 'GET', null, {
        Authorization: `Bearer ${accessToken}`
      });

      const githubUsername = githubUserData?.login;
      if (!githubUsername) {
        res.status(401).json({ message: 'Invalid access token or unable to fetch GitHub user data' });
        return;
      }
      const redirectUrl = getCallbackUrlWithToken(accessToken);

      const existingUser = await GithubUserSchema.findOneAndUpdate(
        { username: githubUsername },
        { accessToken: accessToken },
        { new: true }
      );

      if (existingUser) {
        return res.redirect(redirectUrl);
      }

      const newUser = new GithubUserSchema({
        username: githubUsername,
        avatarUrl: githubUserData.avatar_url ?? '',
        email: githubUserData.email ?? '',
        id: githubUserData.id,
        accessToken
      });

      // Save the new user to the database
      await newUser.save();

      res.redirect(redirectUrl);
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

/////////////////////////////////////////////////////////////
//#endregion
