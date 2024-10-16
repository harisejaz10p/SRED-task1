
// schema
export const GitHubUserCollectionName = 'github-integration';

// routes
export const EXTERNAL_AUTH_BASE_URL = '/api/github';
export const EXTERNAL_AUTH_GITHUB_URL = '/auth';
export const EXTERNAL_AUTH_GITHUB_CALLBACK_URL = '/callback';
export const EXTERNAL_AUTH_GITHUB_IDENTITY_URL = '/identity';
export const EXTERNAL_AUTH_GITHUB_REMOVE_URL = '/remove';
export const GITHUB_REPOS_URL = '/repos';
export const GITHUB_REPOS_DATA_URL = '/repos-data';
export const GITHUB_REPOS_CHANGE_INCLUDE = '/repos-change-include/:id';


// github
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
export const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL!;
export const GITHUB_IDENTITY_URL = 'https://api.github.com/user';
export const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
export const GITHUB_USER_ORGS_URL = 'https://api.github.com/user/orgs'
export const GITHUB_USER_REPOS_URL = 'https://api.github.com/user/repos';

