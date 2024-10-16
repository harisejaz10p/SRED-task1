import { IGithubRepoResponse } from "./github-repo.interface";

/**
 * Interface for the Github Organization Response
 */
export interface IGithubOrganizationResponse {
    readonly login: string;
    readonly id: number;
    readonly repos: readonly IGithubRepoResponse[];
}