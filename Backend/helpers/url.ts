import { GITHUB_CLIENT_ID } from "../constants/constants";

const GITHUB_SCOPES = Object.freeze(['repo', 'read:org', 'repo:status', 'read:user']);

/**
 * Get the URL of the Github OAuth page
 * @param clientID - Github Client ID
 * @param redirectUri - Redirect URI
 * @returns - Github OAuth URL
 */
export const getGithubOAuthUrl = (clientID: string, redirectUri: string): string => {
    return `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectUri}&scope=${GITHUB_SCOPES.join(' ')}`;
};

/**
 * Get the URL to revoke the Github token
 * @returns - Github token revoke URL
 */
export const revokeGithubTokenUrl = () => {
    return `https://api.github.com/applications/${GITHUB_CLIENT_ID}/token`;
}

/**
 * Get the URL to fetch the Github user data
 * @param owner - Github owner
 * @param repo - Github repo
 * @returns - Github issues URL
 */
export const getGithubIssuesUrl = (owner: string, repo: string) => {
    return `https://api.github.com/repos/${owner}/${repo}/issues`;
}

/**
 * Get the URL to fetch the Github pull requests
 * @param owner - Github owner
 * @param repo - Github repo
 * @returns - Github pull requests URL
 */
export const getGithubPullRequestUrl = (owner: string, repo: string) => {
    return `https://api.github.com/repos/${owner}/${repo}/pulls`;
}

/**
 * Get the URL to fetch the Github commits
 * @param owner - Github owner
 * @param repo - Github repo
 * @returns - Github commits URL
 */
export const getGithubCommitsUrl = (owner: string, repo: string) => {
    return `https://api.github.com/repos/${owner}/${repo}/commits`;
}

/**
 * Get callback URL with token
 * @param token - Access token
 * @returns - Callback URL
 */
export const getCallbackUrlWithToken = (token: string) => {
    const url = process.env.FRONTEND_REDIRECT_URL || 'http://localhost:4200/oauth/callback';
    return `${url}?access_token=${token}`;
}

/**
 * Gets the URL to fetch the Github organization repositories.
 * @param orgLogin - Github organization login
 * @returns - Github organization repositories URL
 */
export const getGithubOrgRepoUrl = (orgLogin: string) => {
    return `https://api.github.com/orgs/${orgLogin}/repos`;
}