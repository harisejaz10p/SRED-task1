import { Request, Response } from 'express';
import { fetchAllUserOrganizations, fetchMultipleRepoData } from '../helpers/github-util';
import { saveOrganizationRepos, getRepos, findUserByToken, getIncludedRepos, updateIncludedRepos } from '../helpers/user';
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
            const user = await findUserByToken(accessToken);
            if (!user) {
                res.status(401).json({ message: 'Invalid access token or unable to fetch user data' });
                return;
            }
            const data = await fetchAllUserOrganizations(accessToken);
            saveOrganizationRepos(user, data)
            const repos = await getRepos(user.username);
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
        const includedRepos = await getIncludedRepos()
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
            const result = await updateIncludedRepos(id, organization, included);
            !result ? res.status(404).json({ message: 'Repository not found or no changes applied.' }) : res.status(200).json({ message: 'Repository included status updated successfully.' });

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
