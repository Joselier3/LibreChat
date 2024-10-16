const {
  getWorkspaceById,
  findWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspaceById,
  workspaceConnection,
  updateActiveWorkspace,
} = require('~/models/workspaceMethods');
const { getUserById, CriteriaUpdateUser } = require('~/models/userMethods');
const { logger } = require('~/config');
const { GridFSBucket, MongoClient, ObjectId } = require('mongodb');
const User = require('~/models/User');
const { Types } = require('mongoose');
const Conversation = require('~/models/schema/convoSchema');
const { createSharedLink } = require('~/models/Share');
const MONGO_URI = process.env.MONGO_URI;

const getWorkspaceController = async (req, res) => {
  try {
    let workspace = await getWorkspaceById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Obtener la información completa del propietario del workspace
    const owner = await getUserById(workspace.owner);

    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    // Desplegar los workspaces del owner
    if (owner.workspaces) {
      owner.workspaces = await Promise.all(
        owner.workspaces.map(async (workspaceId) => {
          return await getWorkspaceById(workspaceId);
        }),
      );
    }
    // Obtener la información completa de cada miembro
    const members = await Promise.all(
      workspace.members.map(async (memberId) => {
        const member = await getUserById(memberId);
        if (!member) {
          throw new Error(`Member not found: ${memberId}`);
        }
        return member;
      }),
    );

    workspace = { ...workspace, owner, members };

    res.status(200).json(workspace);
  } catch (error) {
    logger.error('[getWorkspaceController]', error);
    res.status(500).json({ message: 'Error fetching workspace' });
  }
};

const getAllWorkspacesController = async (req, res) => {
  try {
    const workspaces = await findWorkspace({});
    res.status(200).json(workspaces);
  } catch (error) {
    logger.error('[getAllWorkspacesController]', error);
    res.status(500).json({ message: 'Error fetching workspaces' });
  }
};

const createWorkspaceController = async (req, res) => {
  try {
    const workspace = createWorkspace(req.body, true);
    res.status(201).json(workspace);
  } catch (error) {
    logger.error('[createWorkspaceController]', error);
    res.status(500).json({ message: 'Error creating workspace' });
  }
};

const updateWorkspaceController = async (req, res) => {
  console.log('[updateWorkspaceController ]', req.body);
  try {
    const workspace = await updateWorkspace(req.params.workspaceId, { $set: req.body }, {
      new: true,
    });

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    const user = await getUserById(workspace.owner);
    workspace.owner = user;

    res.status(200).json(workspace);
  } catch (error) {

    res.status(500).json({ message: 'Error updating workspace' });
  }
};

const deleteWorkspaceController = async (req, res) => {
  try {

    const workspace = await deleteWorkspaceById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    if (workspace.owner) {
      // Actualizar el propietario, removiendo el workspace de su lista
      await User.updateOne(
        { _id: workspace.owner },
        { $pull: { workspaces: workspace._id } },
      );
    }

    res.status(200).json({ message: 'Workspace deleted successfully' });
  } catch (error) {
    logger.error('[deleteWorkspaceController]', error);
    res.status(500).json({ message: 'Error deleting workspace' });
  }
};

const getAvatarWorkspace = async (req, res) => {
  try {
    const client = await MongoClient.connect(MONGO_URI);
    const db = client.db('Assistant-AI');
    const bucket = new GridFSBucket(db, {
      bucketName: 'avatars',
    });

    const avatarId = req.params.workspaceId;

    const downloadStream = bucket.openDownloadStream(new ObjectId(avatarId));

    downloadStream.on('error', (err) => {
      console.error('Error retrieving avatar:', err);
      res.status(404).send({ message: 'Avatar not found' });
    });

    res.set('Content-Type', 'image/*');
    res.set('Cache-Control', 'no-store');

    downloadStream.pipe(res).on('finish', () => {
      client.close();
    });
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving avatar' });
  }
};

const getUserWorkspacesController = async (req, res) => {
  try {

    const user = await getUserById(req.params.userId);
    // console.log('[getUserWorkspacesController]',user, req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const workspaces = await Promise.all(
      user.workspaces.map(async (workspaceId) => {
        const workspace = await getWorkspaceById(workspaceId);
        const owner = await getUserById(workspace?.owner);
        return { ...workspace, owner };
      }),
    );

    res.status(200).json(workspaces);
  } catch (error) {
    logger.error('[getUserWorkspacesController]', error);
    res.status(500).json({ message: 'Error fetching workspaces' });
  }
};

const getWorkspaceMembersController = async (req, res) => {
  try {
    const workspace = await getWorkspaceById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    const members = await Promise.all(
      workspace.members.map(async (memberId) => {
        return await getUserById(memberId);
      }),
    );

    res.status(200).json(members);
  } catch (error) {
    logger.error('[getWorkspaceMembersController]', error);
    res.status(500).json({ message: 'Error fetching members' });
  }
};

const leaveWorkspaceController = async (req, res) => {
  try {
    const { workspaceId, userId } = req.params;
    console.log('[leaveWorkspaceController]', { workspaceId, userId });

    // Buscar el workspace
    const workspace = await getWorkspaceById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: 'Área de trabajo no encontrada' });
    }

    // Verificar si el usuario es miembro
    const result = workspace.members.some(id => id.toString() === userId.toString());

    if (!result) {
      return res.status(400).json({ message: 'El usuario no es miembro de este área de trabajo' });
    }

    // Eliminar al usuario del array de miembros
    await updateWorkspace(workspaceId, { $pull: { members: userId } });

    // Eliminar el área de trabajo de la lista de workspaces del usuario
    await CriteriaUpdateUser(userId, { $pull: { workspaces: workspaceId } });

    res.status(200).json({ message: 'Has salido del área de trabajo exitosamente' });
  } catch (error) {
    console.error('Error al salir del área de trabajo:', error);
    res.status(500).json({ message: 'Error al salir del área de trabajo', error });
  }
};

const createConnectionController = async (req, res) => {

  const { workspaceId, ...connectionData } = req.body;

  const connections = {
    ...connectionData,
    _id: new Types.ObjectId(), // Genera un ObjectId para la conexión
    createdAt: new Date(), // Fecha de creación
    updatedAt: new Date(), // Fecha de actualización
  };

  try {
    const result = await workspaceConnection(workspaceId, { $push: { connections } });

    if (!result) {
      return res.status(400).json({ message: 'Error al crear la conexión' });
    }

    res.status(200).json({ data: result, message: 'Conexión creada exitosamente' });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error to create the new connection', error });
  }

};

const updateConnectionController = async (req, res) => {
  // console.log('[updateConnectionController]', req.body);

  try {
    const { workspaceId, connectionId, provider, apiKey, models, name } = req.body;

    // Buscar el workspace por su ID
    const workspace = await findWorkspace({ _id: workspaceId });

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Buscar la conexión específica dentro del array 'connections'
    const connectionIndex = workspace.connections.findIndex(conn => conn._id.toString() === connectionId);

    if (connectionIndex === -1) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    // Actualizar los campos de la conexión específica
    workspace.connections[connectionIndex] = {
      ...workspace.connections[connectionIndex],
      provider,
      models,
      name,
      updatedAt: new Date(),
    };

    if (apiKey) {
      workspace.connections[connectionIndex].apiKey = apiKey;
    }

    // Guardar el workspace con la conexión actualizada usando updateWorkspace
    const updatedWorkspace = await updateWorkspace(workspaceId, { $set: { connections: workspace.connections } });

    res.status(200).json({ message: 'Conexión actualizada exitosamente', data: updatedWorkspace });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error to create the new connection', error });
  }

};

const getWorkspaceConnectionController = async (req, res) => {
  try {
    const { workspaceId, userId, provider } = req.params;
    // console.log('[getWorkspaceConnectionController]', { workspaceId, userId });

    let workspace = await findWorkspace({ _id: workspaceId, owner: userId });

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Busca la conexión específica por connectionId
    const connection = workspace.connections.find(conn => conn.provider === provider);

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    const { apiKey, ...resData } = connection;
    // Devuelve la conexión en cuestión
    res.status(200).json(resData);
  } catch (error) {
    logger.error('[getWorkspaceController]', error);
    res.status(500).json({ message: 'Error fetching workspace' });
  }
};

const getAllConversationForUserController = async (req, res) => {
  try {
    const { userId, ownerId } = req.params;

    // Busca todas las conversaciones en las que el usuario esté involucrado
    const allConversationforUser = await Conversation.find({ user: userId });

    if (!allConversationforUser || allConversationforUser.length === 0) {
      return res.status(404).json({ message: 'No se encontraron conversaciones para este usuario' });
    }

    // Personalizar la respuesta según si el usuario es el propietario de la conversación o no
    const customizedConversations = await Promise.all(
      allConversationforUser.map(async (conversation) => {
        // Si el usuario es el propietario, retornar el enlace directo a la conversación
        if (conversation.user.toString() === ownerId) {
          return {
            conversationId: conversation._id,
            link: `/c/${conversation.conversationId}`,
            title: conversation.title,
            updatedAt: conversation.updatedAt,
            model: conversation.model,
            user: conversation.user,
            endpoint: conversation.endpoint,
            owner: true,
          };
        }

        return {
          conversationId: conversation.conversationId,
          title: conversation.title,
          updatedAt: conversation.updatedAt,
          model: conversation.model,
          user: conversation.user,
          endpoint: conversation.endpoint,
          owner: false,
        };
      }),
    );

    // Responde con las conversaciones encontradas
    res.status(200).json({
      message: 'Conversaciones obtenidas exitosamente',
      conversations: customizedConversations,
    });
  } catch (error) {
    console.error('Error al obtener conversaciones:', error);
    res.status(500).json({ message: 'Error al obtener las conversaciones', error });
  }
};

const generateShareLinkConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.find({ conversationId });

    if (!conversation || conversation.length === 0) {
      return res.status(404).json({ message: 'No se encontraron conversaciones para este usuario' });
    }

    const objCreateShareLink = {
      conversationId: conversation[0]?.conversationId,
      title: conversation[0]?.title,
      isAnonymous: true,
      isPublic: true,
      isVisible: true,
    };

    const sharedLink = await createSharedLink(conversation[0]?.user, objCreateShareLink);

    res.status(200).json({
      message: 'shareLink generado exitosamente',
      shareLink: `/share/${sharedLink.shareId}`,
    });
  } catch (error) {
    console.error('Error al obtener conversaciones:', error);
    res.status(500).json({ message: 'Error al obtener las conversaciones', error });
  }
};

const updateActiveWorkspaceController = async (req, res) => {
  const { userId } = req.params;
  const { workspaceId } = req.body;

  try {
    await updateActiveWorkspace({ userId, workspaceId });

    return res.status(200).json({
      status: 'success',
      message: 'Workspace activo actualizado correctamente',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al actualizar el workspace activo',
    });
  }
};

module.exports = {
  getWorkspaceController,
  getAllWorkspacesController,
  createWorkspaceController,
  updateWorkspaceController,
  deleteWorkspaceController,
  getAvatarWorkspace,
  getUserWorkspacesController,
  getWorkspaceMembersController,
  leaveWorkspaceController,
  createConnectionController,
  updateConnectionController,
  getWorkspaceConnectionController,
  getAllConversationForUserController,
  generateShareLinkConversation,
  updateActiveWorkspaceController,
};
