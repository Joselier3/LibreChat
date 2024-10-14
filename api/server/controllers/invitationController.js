const { v4: uuidv4 } = require('uuid');
const { getWorkspaceById, findWorkspace } = require('~/models/workspaceMethods');
const Invitation = require('~/models/schema/invitationSchema');
const { getUserById, findUser } = require('~/models/userMethods');
const { sendEmail } = require('~/server/utils');
const { validateInvitation, acceptInvitation, findInvitation } = require('~/models/invitationMethods');

const getAllInvitationForUser = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'El ID del usuario es requerido' });
  }

  // Busca todas las invitaciones realizadas por el usuario
  const invitations = await Invitation.find({ invitedEmail: id });
  // const existingUser = await findUser({ email: invitedEmail });

  if (invitations.length === 0) {
    return res.status(404).json({ invitations: [], message: 'No se encontraron invitaciones para este usuario' });
  }

  // Formateamos la respuesta para devolver solo la información solicitada
  const formattedInvitation = await Promise.all(
    invitations.map(async (invitation) => {
      const user = await getUserById(invitation.invitedBy);
      const workspace = await getWorkspaceById(invitation.workspace);

      return {
        workspaceName: workspace.name,
        mewMembers: invitation.invitedEmail,
        ownerName: user.name,
        ownerEmail: user.email,
        code: invitation.code,
      };
    }),
  );

  res.status(200).json({
    message: 'Invitaciones obtenidas exitosamente',
    invitations: formattedInvitation,
  });

};

const createInvitation = async (req, res) => {
  try {
    const { userId, workspaceId, invitedEmail } = req.body;

    // Verifica si el área de trabajo existe
    const workspace = await getWorkspaceById(workspaceId);
    const user = await getUserById(userId);
    const existingUser = await findUser({ email: invitedEmail });

    if(existingUser){
      const existingUserInWorkspace = await findWorkspace({ _id:workspace._id, members:  existingUser?._id   });

      if(existingUserInWorkspace){
        return res.status(409).json({ message: 'El usuario ya se encuentra en el Área de trabajo.' });
      }
    }

    // console.log({ workspace,user, existingUser });

    if (!workspace) {
      return res.status(404).json({ message: 'Área de trabajo no encontrada' });
    }

    const existingInvitation = await Invitation.findOne({
      workspace: workspaceId,
      invitedEmail: invitedEmail.toLowerCase(),
      expiresAt: { $gt: new Date() }, // Solo verifica invitaciones que aún no hayan expirado
      status: 'pending',
      status: 'pending',
    });

    console.log(existingInvitation);

    if (existingInvitation) {
      return res.status(400).json({ message: 'Ya existe una invitación pendiente para este correo en esta área de trabajo' });
    }

    // Genera un código de invitación único

    const invitationCode = uuidv4();

    // Crea la invitación
    const invitation = new Invitation({
      workspace: workspaceId,
      invitedEmail: invitedEmail.toLowerCase(),
      invitedBy: userId,
      code: invitationCode,
      expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Expira en 2 días
    });

    await invitation.save();

    // // Enlace de invitación
    const invitationLink = `${req.protocol}://${req.get('host')}/register?invitation=${invitationCode}`;
    const invitationLinkForExistingUser = `${req.protocol}://${req.get('host')}/login`;

    const email = existingUser ? existingUser.name : invitedEmail;
    const link = existingUser ? invitationLinkForExistingUser : invitationLink;

    // // Enviar el correo electrónico con la invitación
    await sendEmail({
      email: invitedEmail,
      subject: 'Invitación a unirse al Área de Trabajo',
      payload: {
        name: email, // o el nombre del usuario si lo tienes
        workspaceName: workspace.name,
        link,
        userName: user.name,
      }, // Asegúrate de tener las propiedades necesarias para la plantilla
      template: 'invitation.handlebars', // Nombre de la plantilla
    });

    res.status(201).json({
      message: 'Invitación creada exitosamente',
      invitationLink: link,
    });
  } catch (error) {
    console.log('[createInvitation]', error);
    res.status(500).json({ message: 'Error al crear la invitación', error });
  }
};

const validateInvitationController = async (req, res) =>{
  try {
    const { code, email } = req.body; // Extraer code y email del cuerpo de la solicitud

    // Llamar a la función validateInvitation con los datos recibidos
    const invitation = await validateInvitation(code, email);

    // Responder con la invitación validada
    res.status(200).json({
      message: 'Invitación válida',
      invitation,
    });
  } catch (error) {
    console.error('[validateInvitationController]', error);
    res.status(400).json({
      message: error.message || 'Error al validar la invitación',
    });
  }
};

const acceptInvitationController = async (req, res) => {
  try {
    const { invitationId, userId } = req.body; // Extraer invitationId y userId del cuerpo de la solicitud

    // Llamar a la función acceptInvitation con los datos recibidos
    const result = await acceptInvitation(invitationId, userId);

    // Responder con el resultado de la aceptación
    res.status(200).json({
      message: 'Invitación aceptada exitosamente',
      result,
    });
  } catch (error) {
    console.error('[acceptInvitationController]', error);
    res.status(400).json({
      message: error.message || 'Error al aceptar la invitación',
    });
  }
};

const rejectInvitation = async (req, res) => {
  try {
    const { id: invitationId } = req.params;
    console.log('[rejectInvitation]',invitationId);

    // Verifica si la invitación existe
    const invitation = await Invitation.findById(invitationId);
    if (!invitation) {
      return res.status(404).json({ message: 'Invitación no encontrada' });
    }

    // Elimina la invitación de la base de datos
    await Invitation.findByIdAndDelete(invitationId);

    return res.status(200).json({ message: 'Invitación rechazada exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al rechazar la invitación', error });
  }
};

const getInvitationForCode = async (req, res) => {
  const { code } = req.params;

  if (!code) {
    return res.status(400).json({ message: 'El ID del usuario es requerido' });
  }

  const invitation = await findInvitation({ code });

  const workspace = await getWorkspaceById(invitation.workspace);

  return res.status(200).json({
    message: 'Invitación obtenida exitosamente',
    invitation: { code: invitation.code, name: workspace.name },
  });

};

module.exports = {
  createInvitation,
  getAllInvitationForUser,
  validateInvitationController,
  acceptInvitationController,
  rejectInvitation,
  getInvitationForCode,
};
