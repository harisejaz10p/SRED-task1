/**
 * Get the URL of the Github OAuth page
 * @param clientID - Github Client ID
 * @param redirectUri - Redirect URI
 * @returns - Github OAuth URL
 */
export const getGithubOAuthUrl = (clientID: string, redirectUri: string): string => {
    console.log(clientID, redirectUri);
    return `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectUri}&scope=user:email`;
};

