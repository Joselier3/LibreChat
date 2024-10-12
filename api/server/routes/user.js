const express = require('express');
const { requireJwtAuth, canDeleteAccount, verifyEmailLimiter } = require('~/server/middleware');
const {
  getUserController,
  deleteUserController,
  verifyEmailController,
  updateUserPluginsController,
  resendVerificationController,
  getTermsStatusController,
  acceptTermsController,
  getUserIdController,
  updateUserController,
} = require('~/server/controllers/UserController');
const { getUserWorkspacesController } = require('~/server/controllers/WorkspaceController');

const router = express.Router();

router.get('/', requireJwtAuth, getUserController);
router.get('/:id', getUserIdController);
router.put('/', updateUserController);
router.get('/terms', requireJwtAuth, getTermsStatusController);
router.post('/terms/accept', requireJwtAuth, acceptTermsController);
router.post('/plugins', requireJwtAuth, updateUserPluginsController);
router.delete('/delete', requireJwtAuth, canDeleteAccount, deleteUserController);
router.post('/verify', verifyEmailController);
router.post('/verify/resend', verifyEmailLimiter, resendVerificationController);
router.get('/:userId/workspaces', getUserWorkspacesController);

module.exports = router;
