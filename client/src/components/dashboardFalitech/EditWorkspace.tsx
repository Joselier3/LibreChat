import React, { useEffect, useState } from 'react';
import Avatar from './Avatar';
import { useWorkspace } from './workspaceContext';
import { useUpdateWorkspace } from './ReactQueryServices';
import { LuLoader2 } from 'react-icons/lu';
import { useToastContext } from '~/Providers';

export default function EditWorkspace() {
  const { selectedWorkspace, selectWorkspace } = useWorkspace();
  const { showToast } = useToastContext();

  const [stateUser, setStateUser] = useState<string>(selectedWorkspace?.name || '');

  const { mutate, isLoading } = useUpdateWorkspace();

  useEffect(() => {
    setStateUser(selectedWorkspace?.name || '');
  }, [selectedWorkspace]);

  function handlerSubmit(e) {
    e.preventDefault();
    const data = {
      workspaceId: selectedWorkspace?._id,
      data: { name: stateUser },
    };
    mutate(data, {
      onSuccess(data){
        showToast({ message: '¡Área de trabajo actualizada exitosamente!', status: 'success' });
        selectWorkspace(data);
      },
    });

  }

  return (
    <section className="w-full p-4">
      <div className="mb-8 overflow-hidden rounded-md border shadow">
        <h2 className="p-4">Logotipo del espacio de trabajo</h2>
        <div className="bg-gray-50 p-6 flex flex-wrap items-center gap-2 justify-center">
          <Avatar text={selectedWorkspace?.name} size='w-12 h-12' />
          <button className='border p-2 text-gray-500 rounded-md'>Actualizar foto</button>
        </div>
      </div>
      <div className="mb-8 overflow-hidden rounded-md border shadow">
        <h2 className="p-4">Actualizar el nombre del espacio de trabajo</h2>
        <div className="bg-gray-50 p-4">
          <form onSubmit={handlerSubmit} className="max-w-96 m-auto flex flex-col gap-3 ">
            <fieldset className='flex items-center flex-wrap gap-1'>
              <span className="block">Id del espacio de trabajo</span>
              <input disabled readOnly defaultValue={selectedWorkspace?._id} type="text" className="w-full md:flex-grow rounded-lg border p-2 focus:outline-[#0084ff]/60 " />
            </fieldset>
            <fieldset className='flex items-center flex-wrap gap-1'>
              <span className="block">Nombre</span>
              <input type="text" value={stateUser} onChange={(e) => setStateUser(e.target.value)} className="w-full md:flex-grow rounded-lg border p-2 focus:outline-[#0084ff]/60 " />
            </fieldset>

            <button type="submit" disabled={!stateUser || isLoading} className="mt-3 rounded-md border bg-[#2791d1]/80 p-2 px-5 text-white transition-all hover:bg-[#2791d1] flex items-center gap-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:border-gray-100 disabled:text-gray-400 w-max">
              {isLoading && <LuLoader2 className='animate-spin' />}
            Actualizar
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
