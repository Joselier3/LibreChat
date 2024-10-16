/* eslint-disable no-useless-catch */
const API_BASE_URL = '/api/workspaces';

export const getUserById = async (userId) => {
  try {
    const response = await fetch(`/api/user/${userId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Error fetching workspaces: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // console.error('Error fetching workspaces:', error);
    throw error;
  }
};

// Obtener todos los workspaces
export const getAllWorkspaces = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Error fetching workspaces: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // console.error('Error fetching workspaces:', error);
    throw error;
  }
};

// Obtener un workspace por ID
export const getWorkspaceById = async (workspaceId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${workspaceId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Error fetching workspace: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // console.error('Error fetching workspace:', error);
    throw error;
  }
};

// Crear un nuevo workspace
export const createWorkspace = async (data) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error creating workspace: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // console.error('Error creating workspace:', error);
    throw error;
  }
};

// Actualizar un workspace
export const updateWorkspace = async (updateData) => {

  const { workspaceId, data } = updateData;

  try {
    const response = await fetch(`${API_BASE_URL}/${workspaceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error updating workspace: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // console.error('Error updating workspace:', error);
    throw error;
  }
};

// Eliminar un workspace
export const deleteWorkspace = async (workspaceId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${workspaceId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error deleting workspace: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // console.error('Error deleting workspace:', error);
    throw error;
  }
};

//salir un workspace
export const leaveWorkspace = async (data) => {
  try {
    //recibe  {workspaceId, userId}
    const { workspaceId, userId } = data;
    const response = await fetch(`/api/workspaces/leave/${workspaceId}/${userId}`,{
      method: 'DELETE',
    });
    return await response.data;
  } catch (error) {
    console.error('Error al salir del área de trabajo:', error);
    throw error;
  }
};

export const getAvatar = async (workspaceId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${workspaceId}/avatar`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Error fetching avatar: ${response.statusText}`);
    }

    console.log(await response.blob());

    // Convertir el flujo de datos en un blob
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    // console.error('Error deleting workspace:', error);
    throw error;
  }
};

export const getUserWorkspaces = async (userId) => {
  try {
    const response = await fetch(`/api/user/${userId}/workspaces`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Error fetching user workspaces: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // console.error('Error fetching user workspaces:', error);
    throw error;
  }
};

export const getWorkspaceMembers = async (workspaceId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${workspaceId}/members`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Error fetching workspace members: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // console.error('Error fetching workspace members:', error);
    throw error;
  }
};

export const createInvitation = async (data) => {
  try {
    // recibe: workspaceId, invitedEmail, userId
    const response = await fetch('/api/invitation/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al crear la invitación');
    }

    return await response.json();
  } catch (error) {
    // console.error('Error:', error);
    throw error;
  }
};

export const validateInvitation = async (validateData) => {
  try {
    const response = await fetch('/api/invitation/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validateData),
    });

    if (!response.ok) {
      throw new Error('Invitación no válida o ha expirado');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // console.error('Error:', error);
    throw error;
  }
};

export const acceptInvitation = async (validateData) => {
  try {
    const response = await fetch('/api/invitation/accept', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validateData),
    });

    if (!response.ok) {
      throw new Error('Error al aceptar la invitación');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // console.error('Error:', error);
    throw error;
  }
};

export const getInvitationForUser = async (id) => {
  try {
    const response = await fetch(`/api/invitation/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Invitación no válida o ha expirado');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // console.error('Error:', error);
    throw error;
  }
};

export const getInvitationForCode = async (code) => {

  try {
    const response = await fetch(`/api/invitation/find/${code}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Invitación no válida o ha expirado');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // console.error('Error:', error);
    throw error;
  }
};

export const rejectInvitationApiCall = async (invitationId) => {

  try {
    const response = await fetch(`/api/invitation/${invitationId}/reject`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error al rechazar la invitación');
    }

    return response.json();
  } catch (	error ) {
    // console.error('Error:', error);
    throw error;
  }
};

export const createConnectionApiCall = async (data) => {
  try {
    // recibe: workspaceId, invitedEmail, userId
    const response = await fetch(`${API_BASE_URL}/connection/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al crear la invitación');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateConnectionApiCall = async (data) => {
  try {
    // recibe: workspaceId, invitedEmail, userId
    const response = await fetch(`${API_BASE_URL}/connection/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al crear la invitación');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getWorkspaceConnection = async (data) => {
  try {
    //recibe  {workspaceId, userId}
    const { workspaceId, userId, provider } = data;

    // Realiza la solicitud al backend
    const response = await fetch(`${API_BASE_URL}/connection/${workspaceId}/${userId}/${provider}`);

    // Asegúrate de que la respuesta es válida
    if (!response.ok) {
      throw new Error('Error al obtener la conexión del workspace');
    }

    // Procesa la respuesta como JSON
    const resData = await response.json();

    return resData;

  } catch (error) {
    console.error('Error al obtener la conexión del workspace', error);
    throw error;
  }
};

export const getAllConversationForUser = async (userId, ownerId) => {
  try {
    //http://localhost:3090/share/GjFmjEICth0ySTZyztir1

    // Realiza la solicitud al backend
    const response = await fetch(`${API_BASE_URL}/conversation/all/${userId}/${ownerId}`, {
      method: 'GET',
    });

    // Asegúrate de que la respuesta es válida
    if (!response.ok) {
      throw new Error('Error al obtener la conexión del workspace');
    }

    // Procesa la respuesta como JSON
    const resData = await response.json();

    return resData;

  } catch (error) {
    console.error('Error al salir del área de trabajo:', error);
    throw error;
  }
};

export const generateShareLink = async (conversationId) => {

  try {
    const response = await fetch(`${API_BASE_URL}/conversation/${conversationId}/share`, {
      method: 'GET',
    });

    // Asegúrate de que la respuesta es válida
    if (!response.ok) {
      throw new Error('Error al obtener la conexión del workspace');
    }

    // Procesa la respuesta como JSON
    const resData = await response.json();

    return resData;
  } catch (error) {
    console.error('Error al generar el link para compartir', error);
    throw error;
  };

};

export const selectActiveWorkspace = async ({ userId,workspaceId }) => {

  try{
    const response = await fetch(`/api/user/${userId}/active-workspace`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ workspaceId }),
    });

    // Procesa la respuesta como JSON
    const resData = await response.json();

    return resData;
  }catch(error){
    console.error('Error al generar el link para compartir', error);
    throw error;
  }
};
