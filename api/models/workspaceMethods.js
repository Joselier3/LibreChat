const { updateUser, getUserById } = require('./userMethods');
const Workspace = require('./workspace');
const User = require('~/models/User');
// const { GridFSBucket, MongoClient } = require('mongodb');
// const fs = require('fs');
// const path = require('path');
// const { logger } = require('handlebars');
// const MONGO_URI = process.env.MONGO_URI;

/**
 * Retrieve a workspace by ID and convert the found workspace document to a plain object.
 *
 * @param {string} workspaceId - The ID of the workspace to find and return as a plain object.
 * @param {string|string[]} [fieldsToSelect] - The fields to include or exclude in the returned document.
 * @returns {Promise<Object>} A plain object representing the workspace document, or `null` if no workspace is found.
 */
const getWorkspaceById = async function (workspaceId, fieldsToSelect = null) {
  const query = Workspace.findById(workspaceId);

  if (fieldsToSelect) {
    query.select(fieldsToSelect);
  }

  return await query.lean();
};

/**
 * Search for a single workspace based on partial data and return the matching workspace document as a plain object.
 *
 * @param {Partial<Object>} searchCriteria - The partial data to use for searching the workspace.
 * @param {string|string[]} [fieldsToSelect] - The fields to include or exclude in the returned document.
 * @returns {Promise<Object>} A plain object representing the workspace document, or `null` if no workspace is found.
 */
const findWorkspace = async function (searchCriteria, fieldsToSelect = null) {
  const query = Workspace.findOne(searchCriteria);
  if (fieldsToSelect) {
    query.select(fieldsToSelect);
  }

  return await query.lean();
};

/**
 * Update a workspace with new data without overwriting existing properties.
 *
 * @param {string} workspaceId - The ID of the workspace to update.
 * @param {Object} updateData - An object containing the properties to update.
 * @returns {Promise<Object>} The updated workspace document as a plain object, or `null` if no workspace is found.
 */
const updateWorkspace = async function (workspaceId, updateData) {

  // console.log('[updateWorkspace]', workspaceId, updateData);

  return await Workspace.findByIdAndUpdate(workspaceId, updateData, {
    new: true,
    runValidators: true,
  }).lean();
};

/**
 * Creates a new workspace.
 *
 * @param {Object} data - The workspace data to be created.
 * @param {boolean} [returnWorkspace=false] - Whether to return the created workspace document. Defaults to `false`.
 * @returns {Promise<ObjectId>} A promise that resolves to the created workspace document ID.
 */
const createWorkspace = async (data, returnWorkspace = false) => {
  const { newUserId, ...restData } = data;

  const userId = newUserId || data?.owner;

  try {
    const workspace = await Workspace.create(restData);

    await User.findByIdAndUpdate(userId, { $push: { workspaces: workspace?._id } }, {
      new: true,
      runValidators: true,
    }).lean();

    // await updateUser(userId, { workspaces: workspace?._id });

    if (returnWorkspace) {
      return workspace.toObject();
    }

    return workspace;
  } catch (error) {
    console.error('Error creating workspace:', error);
    throw error;
  }
};

/**
 * Count the number of workspace documents in the collection based on the provided filter.
 *
 * @param {Object} [filter={}] - The filter to apply when counting the documents.
 * @returns {Promise<number>} The count of documents that match the filter.
 */
const countWorkspaces = async function (filter = {}) {
  return await Workspace.countDocuments(filter);
};

/**
 * Delete a workspace by its unique ID.
 *
 * @param {string} workspaceId - The ID of the workspace to delete.
 * @returns {Promise<{ deletedCount: number }>} An object indicating the number of deleted documents.
 */
const deleteWorkspaceById = async function (workspaceId) {
  try {
    // Obtener el workspace y su propietario
    const workspace = await getWorkspaceById({ _id: workspaceId });

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    const ownerId = workspace.owner;

    // Eliminar el workspace del propietario
    await User.updateOne(
      { _id: ownerId },
      { $pull: { workspaces: workspaceId } },
    );

    // Eliminar el workspace de los miembros
    if (workspace.members && workspace.members.length > 0) {
      await User.updateMany(
        { _id: { $in: workspace.members } },
        { $pull: { workspaces: workspaceId } },
      );
    }

    // Eliminar el workspace en sí
    const result = await Workspace.deleteOne({ _id: workspaceId });
    if (result.deletedCount === 0) {
      return { deletedCount: 0, message: 'No workspace found with that ID.' };
    }

    return { deletedCount: result.deletedCount, message: 'Workspace was deleted successfully.' };
  } catch (error) {
    throw new Error('Error deleting workspace: ' + error.message);
  }
};

const workspaceConnection = async (workspaceId, data) => {

  try {

    const workspace = await getWorkspaceById({ _id: workspaceId });

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    const newConnect = await updateWorkspace(workspaceId, data);

    return newConnect;
  } catch (error) {
    throw new Error('Error create connection: ' + error.message);
  }

};

const detectUserInWorkspaces = async (loggedInUser, conversationOwner) => {
  try {
    // 1. Obtener los workspaces del usuario logueado
    const { workspaces } = await getUserById(loggedInUser);

    // Si el usuario logueado no tiene workspaces, no puede acceder
    if (!workspaces || workspaces.length === 0) {
      return false;
    }

    // 2. Iterar sobre los workspaces del usuario logueado
    for (const workspaceId of workspaces) {
      const workspace = await getWorkspaceById(workspaceId);

      // Si el usuario logueado es el propietario del workspace
      if (workspace.owner.toString() === loggedInUser) {
        // console.log({
        //   workspaceOwen: workspace.owner.toString(),
        //   loggedInUser,
        //   conversationOwner,
        //   access: workspace.members.some(member => member.toString() === conversationOwner),
        // });
        // Verificar si el usuario que creó la conversación (conversationOwner) es miembro del workspace
        if (workspace.members.some(member => member.toString() === conversationOwner)) {
          // El propietario tiene acceso a las conversaciones de los miembros
          return true;
        }
      }
    }

    // 3. Si el usuario logueado es el propietario de la conversación
    if (loggedInUser === conversationOwner) {
      return true; // El usuario creador siempre puede acceder a sus propias conversaciones
    }

    // Si ninguna de las condiciones anteriores se cumple, negar el acceso
    return false;
  } catch (error) {
    console.error('Error en detectUserInWorkspaces:', error);
    return false; // Si hay algún error, negar el acceso
  }
};

module.exports = {
  getWorkspaceById,
  findWorkspace,
  updateWorkspace,
  createWorkspace,
  countWorkspaces,
  deleteWorkspaceById,
  workspaceConnection,
  detectUserInWorkspaces,
};
