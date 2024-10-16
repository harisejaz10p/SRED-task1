import { GITHUB_USER_ORGS_URL } from "../constants/constants";
import { IGithubOrganizationResponse } from "../interface/github-organization.interface";
import { GitHubCommit, GitHubIssue, GithubPullRequest, IGithubRepoResponse } from "../interface/github-repo.interface";
import { fetchData } from "./fetch";
import { getGithubCommitsUrl, getGithubIssuesUrl, getGithubOrgRepoUrl, getGithubPullRequestUrl } from "./url";

/**
 * Fetches all repositories for a user with token.
 * @param token - Github access token
 * @returns - List of repositories
 */
export async function fetchAllUserOrganizations(token: string): Promise<readonly IGithubOrganizationResponse[]> {
    let organizations: IGithubOrganizationResponse[] = [];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage) {
        const url = `${GITHUB_USER_ORGS_URL}?per_page=100&page=${page}`;
        const requestHeader = {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json"
        };

        try {
            const { data, headers } = await fetchData<IGithubOrganizationResponse[]>(url, 'GET', undefined, requestHeader);
            organizations = organizations.concat(data);

            const linkHeader = headers.get('link');
            if (linkHeader && linkHeader.includes('rel="next"')) {
                page++;
            } else {
                hasNextPage = false;
            }
        } catch (error) {
            console.error('Error fetching organizations:', error);
            throw error;
        }
    }
    // Fetch repos for each organization using the pagination function
    const orgWithRepos = await Promise.all(
        organizations.map(async (org) => {
            const repos = await fetchOrgReposWithPagination(token, org.login);
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
 * Fetches all repositories for an organization with pagination.
 * @param token - Github access token
 * @param orgLogin - Github organization login
 * @returns - List of repositories
 */
export async function fetchOrgReposWithPagination(token: string, orgLogin: string): Promise<readonly IGithubRepoResponse[]> {
    let repos: IGithubRepoResponse[] = [];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage) {
        const reposUrl = `${getGithubOrgRepoUrl(orgLogin)}?per_page=100&page=${page}`;
        const requestHeader = {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json"
        };

        try {
            const { data, headers } = await fetchData<IGithubRepoResponse[]>(reposUrl, 'GET', undefined, requestHeader);
            repos = repos.concat(data);

            const linkHeader = headers.get('link');
            if (linkHeader && linkHeader.includes('rel="next"')) {
                page++;
            } else {
                hasNextPage = false;
            }
        } catch (error) {
            console.error(`Error fetching repos for org ${orgLogin}:`, error);
            throw error;
        }
    }

    return repos.map(repo => ({
        id: repo.id,
        name: repo.name,
        organization: orgLogin,
        full_name: repo.full_name,
        node_id: repo.node_id,
        html_url: repo.html_url,
    }));
}

/**
 * Fetches multiple repositories data.
 * @param token - Github access token
 * @param repos - List of repositories
 * @returns  - List of repositories data
 */
export async function fetchMultipleRepoData(token: string, repos: RepoOwner[]): Promise<readonly RepoData[]> {
    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json',
    };

    const allRepoData = [] as RepoData[];

    try {
        for (const { owner, repo } of repos) {
            // Fetch Commits
            const { data: commits } = await fetchData<GitHubCommit[]>(getGithubCommitsUrl(owner, repo), 'GET', undefined, headers);

            // Fetch Pull Requests
            const { data: pullRequests } = await fetchData<GithubPullRequest[]>(getGithubPullRequestUrl(owner, repo), 'GET', undefined, headers);

            // Fetch Issues
            const { data: issues } = await fetchData<GitHubIssue[]>(getGithubIssuesUrl(owner, repo), 'GET', undefined, headers);

            allRepoData.push({ owner, repo, commits, pullRequests, issues });
        }

        return allRepoData;
    } catch (error) {
        console.error('Error fetching repository data:', error);
        throw error;
    }
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