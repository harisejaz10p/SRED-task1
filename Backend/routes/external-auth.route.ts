import { Router } from 'express';
import { EXTERNAL_AUTH_GITHUB_CALLBACK_URL, EXTERNAL_AUTH_GITHUB_REMOVE_URL, EXTERNAL_AUTH_GITHUB_IDENTITY_URL, EXTERNAL_AUTH_GITHUB_URL } from '../constants/constants';
import ExternalAuthController from "../controllers/external-auth.controller";

const router = Router();


router.get(EXTERNAL_AUTH_GITHUB_URL, ExternalAuthController.authenticate);
router.get(EXTERNAL_AUTH_GITHUB_CALLBACK_URL, ExternalAuthController.callback);
router.post(EXTERNAL_AUTH_GITHUB_REMOVE_URL, ExternalAuthController.removeIntegration);
router.get(EXTERNAL_AUTH_GITHUB_IDENTITY_URL, ExternalAuthController.getStatus);

export default router;