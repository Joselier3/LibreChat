import React, { useState } from 'react';
import Avatar from './Avatar';
import { useAuthContext } from '~/hooks';
import { useUpdateUser } from './ReactQueryServices';
import { useToastContext } from '~/Providers';

export default function Profile() {
  const { user } = useAuthContext();
  const { showToast } = useToastContext();
  const [stateUser, setStateUser] = useState<string>(user?.name || '');

  const { mutate } = useUpdateUser();

  function handlerSubmit(e) {
    e.preventDefault();
    // console.log({ name: stateUser});
    const updateUser = { id: user?.id, update: { name: stateUser } };
    mutate(updateUser, {
      onSuccess(data) {
        showToast({ message: '¡Usuario actualizado exitosamente!', status: 'success' });
      },
      onError(error) {
        showToast({ message: '¡Ha ocurrido un error!', status: 'error' });
      },
    });
  }

  return (
    <section className="w-full p-4">
      <div className="mb-8 overflow-hidden rounded-md border shadow">
        <h2 className="p-4">Foto de perfil</h2>
        <div className="flex flex-wrap items-center justify-center gap-2 bg-gray-50 p-6">
          <Avatar text={user?.name} size="w-12 h-12" />
          <button className="rounded-md border p-2 text-gray-500">Actualizar foto</button>
        </div>
      </div>
      <div className="mb-8 overflow-hidden rounded-md border shadow">
        <h2 className="p-4">Información del contacto</h2>
        <div className="bg-gray-50 p-4">
          <form onSubmit={handlerSubmit} className="m-auto flex max-w-96 flex-col gap-3 ">
            <fieldset className="flex flex-wrap items-center gap-1">
              <span className="block">Nombre</span>
              <input
                type="text"
                value={stateUser}
                onChange={(e) => setStateUser(e.target.value)}
                className="w-full rounded-lg border p-2 focus:outline-[#0084ff]/60 md:flex-grow "
              />
            </fieldset>
            <fieldset className="flex flex-wrap items-center gap-1">
              <span className="block">Dirección de correo electrónico</span>
              <input
                disabled
                readOnly
                defaultValue={user?.email}
                type="text"
                className="w-full rounded-lg border p-2 focus:outline-[#0084ff]/60 md:flex-grow "
              />
            </fieldset>
            <button
              type="submit"
              className="mt-3 rounded-md border bg-[#2791d1]/80 p-2 px-5 text-white transition-all hover:bg-[#2791d1]"
            >
              Actualizar
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
