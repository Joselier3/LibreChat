const express = require('express');
const { createInvitation, getAllInvitationForUser, validateInvitationController, acceptInvitationController, rejectInvitation, getInvitationForCode } = require('~/server/controllers/invitationController');

const router = express.Router();

router.get('/:id', getAllInvitationForUser);

router.get('/find/:code', getInvitationForCode);

router.delete('/:id/reject', rejectInvitation);

// Ruta para crear una nueva invitación
router.post('/create', createInvitation);

// Ruta para validar una invitación usando un código
router.post('/validate', validateInvitationController);

// Ruta para aceptar una invitación
router.post('/accept', acceptInvitationController);

module.exports = router;
