import { GITHUB_CLIENT_ID } from "../constants/constants";

/**
 * Get the URL of the Github OAuth page
 * @param clientID - Github Client ID
 * @param redirectUri - Redirect URI
 * @returns - Github OAuth URL
 */
export const getGithubOAuthUrl = (clientID: string, redirectUri: string): string => {
    return `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectUri}&scope=user:email`;
};

/**
 * Get the URL to revoke the Github token
 * @returns - Github token revoke URL
 */
export const revokeGithubTokenUrl = () => {
    return `https://api.github.com/applications/${GITHUB_CLIENT_ID}/tokens}`;
}