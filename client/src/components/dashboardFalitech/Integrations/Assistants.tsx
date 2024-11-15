import { useGetModelsQuery } from 'librechat-data-provider/react-query';
import React, { useEffect, useState } from 'react';
import { useWorkspace } from '../workspaceContext';
import { useGetWorkspaceConnection, useWorkspaceCreateConnection, useWorkspaceUpdateConnection } from '../ReactQueryServices';
import { useAuthContext } from '~/hooks';
import { useToastContext } from '~/Providers';

interface openAiState {
  connectionId:string,
  workspaceId: string,
  provider:string,
  apiKey: string,
  models: string[],
  name: string,
}

export default function Assistants() {
  const { selectedWorkspace, selectWorkspace } = useWorkspace();
  const { user } = useAuthContext();
  const { showToast } = useToastContext();

  const [assistants, setAssistants] = useState<openAiState>({
    connectionId:'',
    workspaceId: selectedWorkspace?._id || '',
    provider: 'assistants',
    apiKey: '',
    models: [],
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
      setAssistants({
        connectionId:connections?._id || '',
        workspaceId: selectedWorkspace?._id || '',
        provider: connections.provider || 'assistants',
        apiKey: connections.apiKey || '', // Si no quieres mostrar la API Key, puedes omitirla
        models: connections.models || [],
        name: connections.name || '',
      });
    }
  }, [connections, selectedWorkspace]);

  function handlerChange(e) {
    const { name, value, checked } = e.target;
    if(checked){
      console.log(value);
      // Agregar la propiedad al array de models si no existe
      setAssistants((prevState) => ({
        ...prevState,
        models: [...prevState.models, value],
      }));
    }else{
      // Eliminar la propiedad del array de models si está desmarcada
      setAssistants((prevState) => ({
        ...prevState,
        models: prevState.models.filter((model) => model !== value),
      }));
    }

    // Actualizar el resto del state normalmente
    if(name !== 'models'){
      setAssistants((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  }

  const { mutate } = useWorkspaceCreateConnection();
  const { mutate: updateMutate } = useWorkspaceUpdateConnection();

  const modelsQuery = useGetModelsQuery();
  const modelOpenAI = modelsQuery.data?.['assistants'] || [];

  const handlerSubmit = (e) => {
    e.preventDefault();

    if (connections) {
    // Si ya existe una conexión, se actualiza
      updateMutate(assistants, {
        onSuccess({ data }) {
          // console.log('Conexión actualizada:', data);
          selectWorkspace({ ...selectedWorkspace, connections: data?.connections || [] });
          showToast({ message: 'Conexión actualizada', status: 'success' });

        },
        onError(error) {
          showToast({ message: 'Error al actualizar la conexión', status: 'error' });
          // console.error('Error al actualizar la conexión:', error);
        },
      });
    } else {
    // Si no hay ninguna conexión, se crea una nueva
      mutate(assistants, {
        onSuccess({ data }) {
          // console.log('Conexión creada:', data);
          selectWorkspace({ ...selectedWorkspace, connections: data?.connections || [] });
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
              <input type="text" value={assistants.name} name='name' onChange={handlerChange} className="w-full md:flex-grow rounded-lg border p-2 focus:outline-[#0084ff]/60 " placeholder='Name IA (optional)' />
            </fieldset>
            <fieldset className='flex items-center flex-wrap gap-1'>
              <span className="block">Api Key</span>
              <input type="text" value={assistants.apiKey} name='apiKey' onChange={handlerChange} className="w-full md:flex-grow rounded-lg border p-2 focus:outline-[#0084ff]/60 " placeholder='************************************' />
            </fieldset>
            <fieldset className='flex flex-col gap-1'>
              <strong className="block">Modelo</strong>
              <ul className='grid grid-cols-[repeat(auto-fill, minmax(200px, 1fr))]'>
                {
                  modelOpenAI.map(model => {
                    const isCurrentModel = connections?.models.some(currentModel => currentModel === model);
                    return (
                      <li key={model} className='flex gap-1 items-center'>
                        <input type="checkbox" name='models' defaultChecked={isCurrentModel} id={model} value={model} onChange={handlerChange}/>
                        <label htmlFor={model}>{model}</label>
                      </li>
                    );
                  })
                }
              </ul>
            </fieldset>
            {/* <fieldset className='flex items-center flex-wrap gap-1'>
              <span className="block">Modelo</span>
              <select name='model'  value={openAi.model} onChange={handlerChange} className="w-full md:flex-grow rounded-lg border p-2 focus:outline-[#0084ff]/60 reset-scrollbar">
                <option value="">-- Select Model --</option>
                {
                  modelOpenAI.map(model => <option key={model} value={model}>{model}</option>)
                }
              </select>
            </fieldset> */}

            <button type='submit' className="mt-3 rounded-md border bg-[#2791d1]/80 p-2 px-5 text-white transition-all hover:bg-[#2791d1]">
              Guardar
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
