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
  updateInfoUserController,
} = require('~/server/controllers/UserController');
const {
  getUserWorkspacesController,
  updateActiveWorkspaceController,
} = require('~/server/controllers/WorkspaceController');

const router = express.Router();

router.get('/', requireJwtAuth, getUserController);
router.get('/:id', getUserIdController);
router.put('/', updateUserController);
router.put('/:id', updateInfoUserController);
router.get('/terms', requireJwtAuth, getTermsStatusController);
router.post('/terms/accept', requireJwtAuth, acceptTermsController);
router.post('/plugins', requireJwtAuth, updateUserPluginsController);
router.delete('/delete', requireJwtAuth, canDeleteAccount, deleteUserController);
router.post('/verify', verifyEmailController);
router.post('/verify/resend', verifyEmailLimiter, resendVerificationController);
router.get('/:userId/workspaces', getUserWorkspacesController);
router.put('/:userId/active-workspace', updateActiveWorkspaceController);

module.exports = router;
