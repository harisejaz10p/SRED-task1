import { EXTERNAL_AUTH_BASE_URL, EXTERNAL_AUTH_GITHUB_CALLBACK_URL, GITHUB_CALLBACK_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_IDENTITY_URL, GITHUB_TOKEN_URL } from "../constants/constants";
import { getCallbackUrlWithToken, getGithubOAuthUrl, revokeGithubTokenUrl } from "../helpers/url";
import { Request, Response } from 'express';
import { fetchData } from "../helpers/fetch";
import { deleteUserByToken, findUserByUsername, saveNewUser, findAndUpdateUser } from "../helpers/user";

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
      const access_token = req.accessToken;
      await deleteUserByToken(access_token);
      const credentials = `${GITHUB_CLIENT_ID}:${GITHUB_CLIENT_SECRET}`;
      const encodedCredentials = btoa(credentials);
      await fetchData(revokeGithubTokenUrl(), 'DELETE', {
        access_token
      }, {
        Authorization: `Basic ${encodedCredentials}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      });
      res.json({ message: `Integration for user removed successfully.` });
    } catch (error) {
      console.error('Error removing GitHub integration:', error);
      res.status(200).json({ message: `Integration for user removed successfully with some complications ` });
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
      const { data: { login: username } } = await fetchData<IGithubUserResponse>(GITHUB_IDENTITY_URL, 'GET', null, {
        Authorization: `Bearer ${accessToken}`
      });

      if (!username) {
        res.status(401).json({ message: 'Invalid access token or unable to fetch GitHub user data' });
        return;
      }

      const storedUser = await findUserByUsername(username);
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
      const { data: { access_token: accessToken } } = await fetchData<{ access_token: string }>(GITHUB_TOKEN_URL, 'POST', {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code
      });

      if (!accessToken) {
        res.status(401).json({ message: 'Failed to obtain access token' });
        return;
      }

      const { data: githubUserData } = await fetchData<IGithubUserResponse>(GITHUB_IDENTITY_URL, 'GET', null, {
        Authorization: `Bearer ${accessToken}`
      });

      if (!githubUserData) {
        res.status(401).json({ message: 'Invalid access token or unable to fetch GitHub user data' });
        return;
      }
      const redirectUrl = getCallbackUrlWithToken(accessToken);
      const existingUser = await findAndUpdateUser(githubUserData.login, accessToken);

      if (existingUser) {
        return res.redirect(redirectUrl);
      }

      await saveNewUser({
        username: githubUserData.login,
        accessToken,
        avatarUrl: githubUserData.avatar_url ?? '',
        email: githubUserData.email ?? '',
        id: githubUserData.id
      });

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
