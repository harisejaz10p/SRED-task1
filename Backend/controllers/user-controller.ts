import { Request, Response } from 'express';
import { fetchAllUserOrganizations, fetchMultipleRepoData } from '../helpers/github-util';
import { IRepoModel, Repo } from '../models/github-repo.model';
import { GithubUserSchema } from "../models/github-user.model";

/**
 * Controller for handling user related requests.
 */
class UserController {

    /**
     * Gets the organizations for the user.
     * @param req - The request object.
     * @param res - The response object.
     */
    public async getOrgRepos(req: Request, res: Response): Promise<void> {
        try {
            //@ts-ignore
            const accessToken = req.accessToken;
            const user = await GithubUserSchema.findOne({ accessToken });
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            const data = await fetchAllUserOrganizations(accessToken);
            for (const org of data) {
                for (const repo of org.repos) {
                    const existingRepo = await Repo.findOne({ id: repo.id });
                    const repoData: IRepoModel = {
                        id: repo.id,
                        name: repo.name,
                        slug: repo.full_name,
                        userLogin: user.username,
                        organization: org.login,
                        included: existingRepo ? existingRepo.included : false,
                        html_url: repo.html_url
                    };

                    await Repo.updateOne(
                        { id: repo.id },
                        repoData,
                        { upsert: true }
                    );
                }
            }

            const repos = await Repo.find({ userLogin: user.username });
            res.json(repos);

        } catch (error) {
            console.error('Error fetching organizations:', error);
            res.status(500).send('Error fetching organizations');
        }
    }

    /**
     * Get the repositories data for the user.
     * @param req - The request object.
     * @param res - The response object.
     */
    public async getReposData(req: Request, res: Response): Promise<void> {
        //@ts-ignore
        const accessToken = req.accessToken;
        const includedRepos = await Repo.find({ included: true });
        if (includedRepos.length === 0) {
            res.json([]);
            return;
        }
        const respData = await fetchMultipleRepoData(accessToken, includedRepos.map(repo => ({
            owner: repo.organization,
            repo: repo.name
        })))

        res.json(respData);
    }

    /**
     * Update the included status of a repository.
     * @param req - The request object.
     * @param res - The response object.
     */
    public async updateIncludedRepos(req: Request, res: Response): Promise<void> {
        try {
            const { included, organization, id } = req.body;

            // Validate request
            if (!id || included === undefined) {
                res.status(400).json({ message: 'Repository ID and included status are required.' });
                return;
            }

            // Find and update the 'included' field of the repository
            const result = await Repo.updateOne({ id, organization }, { included });
            if (result.modifiedCount === 0) {
                res.status(404).json({ message: 'Repository not found or no changes applied.' });
            } else {
                res.status(200).json({ message: 'Repository included status updated successfully.' });
            }

        } catch (error) {
            console.error('Error updating repository included status:', error);
            res.status(500).json({ message: 'Error updating repository included status.' });
        }
    }

}

/**
 * Instance of the user controller.
 */
export default new UserController();
