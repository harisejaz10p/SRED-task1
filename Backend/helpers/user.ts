
import { GithubUserSchema, IGithubUser } from "../models/github-user.model";
import { IRepoModel, Repo, IRepo } from '../models/github-repo.model';
import { IGithubOrganizationResponse } from "../interface/github-organization.interface";

/**
 * Find user by token
 * @param token - Github access token
 * @returns - User data
 */
export const findUserByToken = async (token: string): Promise<IGithubUser | null> => {
    const user = await GithubUserSchema.findOne({ accessToken: token });
    return user;
}

/**
 * Save organization repos
 * @param user - Github user
 * @param data - Organization data
 */
export const saveOrganizationRepos = async (user: IGithubUser, data: readonly IGithubOrganizationResponse[]): Promise<void> => {
    const bulkOperations = [];
    for (const org of data) {
        for (const repo of org.repos) {
            const existingRepo = await Repo.findOne({ id: repo.id }).lean();

            const repoData: IRepoModel = {
                id: repo.id,
                name: repo.name,
                slug: repo.full_name,
                userLogin: user.username,
                organization: org.login,
                included: existingRepo ? existingRepo.included : false,
                html_url: repo.html_url
            };

            bulkOperations.push({
                updateOne: {
                    filter: { id: repo.id },
                    update: repoData,
                    upsert: true
                }
            });
        }
    }

    if (bulkOperations.length > 0) {
        await Repo.bulkWrite(bulkOperations);
    }
}

/**
 * Get all repos for a user
 * @param username - Github username
 * @returns 
 */
export const getRepos = async (username: string): Promise<readonly IRepo[]> => {
    const repos = await Repo.find({ userLogin: username });
    return repos;
}

/**
 * Get included repos
 * @returns - List of included repos
 */
export const getIncludedRepos = async (): Promise<readonly IRepo[]> => {
    const repos = await Repo.find({ included: true });
    return repos;
}

/**
 * Update included repos
 * @param id - Repository ID
 * @param organization - Repository organization
 * @param included - Included status
 * @returns - Update status
 */
export const updateIncludedRepos = async (id: number, organization: string, included: boolean): Promise<boolean> => {
    return (await Repo.updateOne({ id, organization }, { included })).modifiedCount > 0;
}

/**
 * Delete user by token
 * @param token - Github access token
 */
export const deleteUserByToken = async (token: string): Promise<void> => {
    await GithubUserSchema.deleteMany({ accessToken: token });
}

/**
 * Find user by username
 * @param username - Github username
 * @returns - User data
 */
export const findUserByUsername = async (username: string): Promise<IGithubUser | null> => {
    return await GithubUserSchema.findOne({ username });
}

/***
 * Save user
 */
export const saveNewUser = async (args: {
    username: string;
    accessToken: string;
    avatarUrl: string;
    email: string;
    id: number;
}): Promise<void> => {
    const user = new GithubUserSchema(args);
    await user.save();
}

/**
 * Find and update user
 * @param username - Github username
 * @param accessToken - Github access token
 * @returns - User data
 */
export const findAndUpdateUser = async (username: string, accessToken: string): Promise<IGithubUser | null> => {
    return await GithubUserSchema.findOneAndUpdate(
        { username },
        { accessToken },
        { new: true })
}