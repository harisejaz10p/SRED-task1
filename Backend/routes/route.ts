// Routes for setting up external authentication with GitHub

import { Router } from 'express';
import { EXTERNAL_AUTH_GITHUB_CALLBACK_URL, EXTERNAL_AUTH_GITHUB_REMOVE_URL, EXTERNAL_AUTH_GITHUB_IDENTITY_URL, EXTERNAL_AUTH_GITHUB_URL, GITHUB_REPOS_URL, GITHUB_REPOS_DATA_URL, GITHUB_REPOS_CHANGE_INCLUDE } from '../constants/constants';
import ExternalAuthController from "../controllers/external-auth.controller";
import UserController from "../controllers/user-controller";
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

//Auth Routes
router.get(EXTERNAL_AUTH_GITHUB_URL, ExternalAuthController.authenticate);
router.get(EXTERNAL_AUTH_GITHUB_CALLBACK_URL, ExternalAuthController.callback);

// User routes
router.get(GITHUB_REPOS_URL, authMiddleware, UserController.getOrgRepos);
router.get(GITHUB_REPOS_DATA_URL, authMiddleware, UserController.getReposData);
router.patch(GITHUB_REPOS_CHANGE_INCLUDE, authMiddleware, UserController.updateIncludedRepos);
router.post(EXTERNAL_AUTH_GITHUB_REMOVE_URL, authMiddleware, ExternalAuthController.removeIntegration);
router.get(EXTERNAL_AUTH_GITHUB_IDENTITY_URL, authMiddleware, ExternalAuthController.getStatus);

export default router;