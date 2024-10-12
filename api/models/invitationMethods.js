const Invitation = require('./schema/invitationSchema');
const { updateUser } = require('./userMethods');
const { getWorkspaceById, updateWorkspace } = require('./workspaceMethods');

const validateInvitation = async (code, email) => {
  try {
    // Busca la invitación en la base de datos
    const invitation = await Invitation.findOne({ code, invitedEmail: email.toLowerCase() });

    if (!invitation) {
      throw new Error('Invitación no encontrada o inválida');
    }

    // Verifica si la invitación ha expirado
    if (new Date() > invitation.expiresAt) {
      throw new Error('La invitación ha expirado');
    }

    return invitation; // Si todo es correcto, devuelve la invitación
  } catch (error) {
    console.error('Error al validar la invitación:', error);
    throw error; // Lanza el error para manejarlo en la lógica donde se usa esta función
  }
};

// Aceptar una invitación
const acceptInvitation = async (invitationId, userId) => {

  try {
    // Busca la invitación en la base de datos usando el ID
    const invitation = await Invitation.findById(invitationId);

    if (!invitation) {
      throw new Error('Invitación no encontrada o inválida');
    }

    // Verifica si la invitación ha expirado
    if (new Date() > invitation.expiresAt) {
      throw new Error('La invitación ha expirado');
    }

    // Verifica si el usuario ya es miembro del área de trabajo
    const workspace = await getWorkspaceById(invitation.workspace);

    const result = workspace.members.some(id => id.toString() === userId.toString());

    if (result) {
      throw new Error('El usuario ya es miembro del área de trabajo');
    }

    // // Actualizar la lista de workspaces del usuario
    await updateUser(userId, { workspaces: workspace._id });
    await updateWorkspace(workspace._id, { $addToSet: { members: userId } }, {
      new: true,
    });

    // // Eliminar la invitación después de ser aceptada
    await Invitation.deleteOne({ _id: invitationId });

    return { invitations: [],  message: 'Unido al área de trabajo exitosamente' };
  } catch (error) {
    console.error('Error al aceptar la invitación:', error);
    throw error; // Re-lanzar el error para manejarlo donde se use esta función
  }
};

module.exports = {
  validateInvitation,
  acceptInvitation,
};