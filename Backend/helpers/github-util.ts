import { GITHUB_USER_ORGS_URL } from "../constants/constants";
import { IGithubOrganizationResponse } from "../interface/github-organization.interface";
import { GitHubCommit, GitHubIssue, GithubPullRequest, IGithubRepoResponse } from "../interface/github-repo.interface";
import { fetchData } from "./fetch";
import { getGithubCommitsUrl, getGithubIssuesUrl, getGithubOrgRepoUrl, getGithubPullRequestUrl } from "./url";

const PAGINATION_QUERY = "?per_page=100&page=";

function getAuhHeader(toke: string): {
    Authorization: string;
    Accept: string;
} {
    return {
        Authorization: `Bearer ${toke}`,
        Accept: "application/vnd.github+json",
    }
}

/**
 * Fetches all data for given url.
 * @param token - Github access token.
 * @param urlBuilder - Function to build the url.
 * @returns 
 */
async function fetchPaginatedData<T>(
    token: string,
    urlBuilder: (page: number) => string
): Promise<readonly T[]> {
    let results: T[] = [];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage) {
        const url = urlBuilder(page);
        const requestHeader = getAuhHeader(token);
        try {
            const { data, headers } = await fetchData<T[]>(url, 'GET', undefined, requestHeader);
            results = results.concat(data);

            const linkHeader = headers.get('link');
            hasNextPage = (linkHeader && linkHeader.includes('rel="next"')) ? true : false;
            page++;
        } catch (error) {
            console.error('Error fetching paginated data:', error);
            throw error;
        }
    }

    return results;
}

/**
 * Fetches all repositories for a user with token.
 * @param token - Github access token
 * @returns - List of repositories
 */
export async function fetchAllUserOrganizations(token: string): Promise<readonly IGithubOrganizationResponse[]> {
    const organizations = await fetchPaginatedData<IGithubOrganizationResponse>(token, (page) => `${GITHUB_USER_ORGS_URL}${PAGINATION_QUERY}${page}`);
    // Fetch repos for each organization using the pagination function
    const orgWithRepos = await Promise.all(
        organizations.map(async (org) => {
            const repos = await fetchPaginatedData<IGithubRepoResponse>(token, (page) => `${getGithubOrgRepoUrl(org.login)}${PAGINATION_QUERY}${page}`);
            return {
                id: org.id,
                login: org.login,
                repos,
            };
        })
    );
    return orgWithRepos;
}

/**
 * Fetches multiple repositories data.
 * @param token - Github access token
 * @param repos - List of repositories
 * @returns  - List of repositories data
 */
export async function fetchMultipleRepoData(token: string, repos: RepoOwner[]): Promise<readonly RepoData[]> {
    const allRepoData = [] as RepoData[];
    try {
        for (const { owner, repo } of repos) {
            const [commits, pullRequests, issues] = await Promise.all([
                fetchRepoCommits(token, owner, repo),
                fetchRepoPullRequests(token, owner, repo),
                fetchRepoIssues(token, owner, repo),
            ]);

            allRepoData.push({ owner, repo, commits, pullRequests, issues });
        }
        return allRepoData;
    } catch (error) {
        console.error('Error fetching repository data:', error);
        throw error;
    }
}

/**
 * Fetches all commits for a repository.
 * @param token - Github access token
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns - List of commits
 */
export async function fetchRepoCommits(token: string, owner: string, repo: string): Promise<readonly GitHubCommit[]> {
    return fetchPaginatedData<GitHubCommit>(token, (page) => `${getGithubCommitsUrl(owner, repo)}${PAGINATION_QUERY}${page}`);
}

/**
 * Fetches all pull requests for a repository.
 * @param token - Github access token
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns - List of pull requests
 */
export async function fetchRepoPullRequests(token: string, owner: string, repo: string): Promise<readonly GithubPullRequest[]> {
    return fetchPaginatedData<GithubPullRequest>(token, (page) => `${getGithubPullRequestUrl(owner, repo)}${PAGINATION_QUERY}${page}`);
}


/**
 * Fetches all issues for a repository.
 * @param token - Github access token
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns - List of issues
 */
export async function fetchRepoIssues(token: string, owner: string, repo: string): Promise<readonly GitHubIssue[]> {
    return fetchPaginatedData<GitHubIssue>(token, (page) => `${getGithubIssuesUrl(owner, repo)}${PAGINATION_QUERY}${page}`);
}

//#region Internal Region
/////////////////////////////////////////////////////////////

interface RepoOwner {
    readonly owner: string;
    readonly repo: string;
}

interface RepoData {
    readonly owner: string;
    readonly repo: string;
    readonly commits: readonly GitHubCommit[];
    readonly pullRequests: readonly GithubPullRequest[];
    readonly issues: readonly GitHubIssue[];
}

/////////////////////////////////////////////////////////////
//#endregion