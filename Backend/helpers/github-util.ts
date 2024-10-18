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
    let commits = [] as GitHubCommit[];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage) {
        const url = `${getGithubCommitsUrl(owner, repo)}?per_page=100&page=${page}`;
        const requestHeader = {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json"
        };

        try {
            const { data, headers } = await fetchData<GitHubCommit[]>(url, 'GET', undefined, requestHeader);
            commits = commits.concat(data);

            const linkHeader = headers.get('link');
            if (linkHeader && linkHeader.includes('rel="next"')) {
                page++;
            } else {
                hasNextPage = false;
            }
        } catch (error) {
            console.error('Error fetching commits:', error);
            throw error;
        }
    }

    return commits;
}

/**
 * Fetches all pull requests for a repository.
 * @param token - Github access token
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns - List of pull requests
 */
export async function fetchRepoPullRequests(token: string, owner: string, repo: string): Promise<readonly GithubPullRequest[]> {
    let pullRequests = [] as GithubPullRequest[];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage) {
        const url = `${getGithubPullRequestUrl(owner, repo)}?per_page=100&page=${page}`;
        const requestHeader = {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json"
        };

        try {
            const { data, headers } = await fetchData<GithubPullRequest[]>(url, 'GET', undefined, requestHeader);
            pullRequests = pullRequests.concat(data);

            const linkHeader = headers.get('link');
            if (linkHeader && linkHeader.includes('rel="next"')) {
                page++;
            } else {
                hasNextPage = false;
            }
        } catch (error) {
            console.error('Error fetching pull requests:', error);
            throw error;
        }
    }
    return pullRequests;
}


/**
 * Fetches all issues for a repository.
 * @param token - Github access token
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns - List of issues
 */
export async function fetchRepoIssues(token: string, owner: string, repo: string): Promise<readonly GitHubIssue[]> {
    let issues = [] as GitHubIssue[];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage) {
        const url = `${getGithubIssuesUrl(owner, repo)}?per_page=100&page=${page}`;
        const requestHeader = {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json"
        };

        try {
            const { data, headers } = await fetchData<GitHubIssue[]>(url, 'GET', undefined, requestHeader);
            issues = issues.concat(data);

            const linkHeader = headers.get('link');
            if (linkHeader && linkHeader.includes('rel="next"')) {
                page++;
            } else {
                hasNextPage = false;
            }
        } catch (error) {
            console.error('Error fetching issues:', error);
            throw error;
        }
    }
    return issues;
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