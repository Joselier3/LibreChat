const express = require('express');
const {
  getAllWorkspacesController,
  createWorkspaceController,
  getWorkspaceController,
  updateWorkspaceController,
  deleteWorkspaceController,
  getAvatarWorkspace,
  getWorkspaceMembersController,
  leaveWorkspaceController,
  createConnectionController,
  updateConnectionController,
  getWorkspaceConnectionController,
  getAllConversationForUserController,
  generateShareLinkConversation,
} = require('~/server/controllers/WorkspaceController');
const { requireJwtAuth } = require('~/server/middleware');

const router = express.Router();

router.get('/', getAllWorkspacesController); // Obtener todos los workspaces
router.get('/conversation/all/:userId/:ownerId/:workspaceId', getAllConversationForUserController);
router.post('/', createWorkspaceController); // Crear un nuevo workspace
router.get('/:workspaceId', getWorkspaceController); // Obtener un workspace por ID
router.put('/:workspaceId', updateWorkspaceController); // Actualizar un workspace
router.delete('/:workspaceId', deleteWorkspaceController); // Eliminar un workspace
router.delete('/:workspaceId/avatar', getAvatarWorkspace); // Eliminar un workspace
router.get('/:workspaceId/:userId/members', getWorkspaceMembersController);
router.delete('/leave/:workspaceId/:userId', leaveWorkspaceController);
router.get('/connection/:workspaceId/:userId/:provider', getWorkspaceConnectionController);
router.post('/connection/create', createConnectionController);
router.put('/connection/edit', updateConnectionController);
router.get('/conversation/:conversationId/share', generateShareLinkConversation);

module.exports = router;
