import { useGetModelsQuery } from 'librechat-data-provider/react-query';
import React, { useEffect, useState } from 'react';
import { useWorkspace } from '../workspaceContext';
import { useGetWorkspaceConnection, useWorkspaceCreateConnection, useWorkspaceUpdateConnection } from '../ReactQueryServices';
import { useAuthContext } from '~/hooks';
import { useToastContext } from '~/Providers';

export default function Assistants() {
  const { selectedWorkspace, selectWorkspace } = useWorkspace();
  const { user } = useAuthContext();
  const { showToast } = useToastContext();

  const [openAi, setOpenAi] = useState({
    connectionId:'',
    workspaceId: selectedWorkspace?._id,
    provider: 'assistants',
    apiKey: '',
    model: '',
    name: '',
  });

  const { data: connections } = useGetWorkspaceConnection({
    workspaceId: selectedWorkspace?._id,
    userId: user?._id,
    provider: 'assistants',
  });

  // Actualiza el estado si se obtiene una conexión existente
  useEffect(() => {
    if (connections) {
      setOpenAi({
        connectionId:connections?._id || '',
        workspaceId: selectedWorkspace?._id,
        provider: connections.provider || 'assistants',
        apiKey: connections.apiKey || '', // Si no quieres mostrar la API Key, puedes omitirla
        model: connections.model || '',
        name: connections.name || '',
      });
    }
  }, [connections, selectedWorkspace]);

  function handlerChange(e) {
    setOpenAi({ ...openAi, [e.target.name]: e.target.value });
  }

  const { mutate } = useWorkspaceCreateConnection();
  const { mutate: updateMutate } = useWorkspaceUpdateConnection();

  const modelsQuery = useGetModelsQuery();
  const modelOpenAI = modelsQuery.data?.['openAI'] || [];

  const handlerSubmit = (e) => {
    e.preventDefault();

    if (connections) {
    // Si ya existe una conexión, se actualiza
      updateMutate(openAi, {
        onSuccess(data) {
          // console.log('Conexión actualizada:', data);
          showToast({ message: 'Conexión actualizada', status: 'success' });

        },
        onError(error) {
          showToast({ message: 'Error al actualizar la conexión', status: 'error' });
          // console.error('Error al actualizar la conexión:', error);
        },
      });
    } else {
    // Si no hay ninguna conexión, se crea una nueva
      mutate(openAi, {
        onSuccess(data) {
          // console.log('Conexión creada:', data);
          showToast({ message: 'Conexión creada', status: 'success' });
        },
        onError(error) {
          showToast({ message: 'Error al crear la conexión', status: 'error' });
          // console.error('Error al crear la conexión:', error);
        },
      });
    }
  };

  return (
    <section className="w-full p-4">

      <div className="mb-8 overflow-hidden rounded-md border shadow">
        <h2 className="p-4">
          <a href="http://openai.com" target="_blank" rel="noopener noreferrer" className='text-[#0084ff] hover:underline'>Registrarse </a>
          for an Open AI account
        </h2>
        <div className="bg-gray-50 p-4">
          <form onSubmit={handlerSubmit} className="max-w-96 m-auto flex flex-col gap-3 ">
            <fieldset className='flex items-center flex-wrap gap-1'>
              <span className="block">Nombre IA</span>
              <input type="text" value={openAi.name} name='name' onChange={handlerChange} className="w-full md:flex-grow rounded-lg border p-2 focus:outline-[#0084ff]/60 " placeholder='Name IA (optional)' />
            </fieldset>
            <fieldset className='flex items-center flex-wrap gap-1'>
              <span className="block">Api Key</span>
              <input type="text" value={openAi.apiKey} name='apiKey' onChange={handlerChange} className="w-full md:flex-grow rounded-lg border p-2 focus:outline-[#0084ff]/60 " placeholder='************************************' />
            </fieldset>
            <fieldset className='flex items-center flex-wrap gap-1'>
              <span className="block">Modelo</span>
              <select name='model'  value={openAi.model} onChange={handlerChange} className="w-full md:flex-grow rounded-lg border p-2 focus:outline-[#0084ff]/60 reset-scrollbar">
                <option value="">-- Select Model --</option>
                {
                  modelOpenAI.map(model => <option key={model} value={model}>{model}</option>)
                }
              </select>
            </fieldset>

            <button type='submit' className="mt-3 rounded-md border bg-[#2791d1]/80 p-2 px-5 text-white transition-all hover:bg-[#2791d1]">
              Guardar
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
