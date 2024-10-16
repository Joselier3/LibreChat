import React, { useState } from 'react';
import Button from './Button';
import { TUser } from 'librechat-data-provider/dist/types';
import Avatar from './Avatar';
import { useWorkspace } from './workspaceContext';
import { FaCheck, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { MdNotifications } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import { useGetInvitationForUser } from './ReactQueryServices';
import { FaUsers } from 'react-icons/fa';

interface HeaderProps {
  user: TUser | undefined;
  workspace: any[]
}

export default function Header({ user, workspace }: HeaderProps) {
  const { selectedWorkspace, selectWorkspace } = useWorkspace();
  const [open, setOpen] = useState(false);

  const { data } = useGetInvitationForUser(user?.email);

  return (
    <>
      <header className="flex items-center justify-between border-b bg-[#f6f7f8] p-2 shadow">
        <div className="flex items-center gap-2">
          <img src="/assets/falitech.png" alt="" className="h-10 w-10" />
          <Button iconLeft={<Avatar text={selectedWorkspace?.name} />} text={selectedWorkspace?.name}>
            <div className="w-[250px] ">
              <span className=" block p-3 text-gray-300 text-sm">Espacios de Trabajo</span>
              <div className="flex flex-1 flex-col ">
                {workspace && workspace.map((workspace) => {
                  const isCurrentWorkspace = selectedWorkspace?._id === workspace?._id;
                  return (<button
                    onClick={() => selectWorkspace(workspace)}
                    key={workspace._id}
                    className={isCurrentWorkspace ? 'w-full px-3 py-2 text-left hover:bg-gray-100 flex gap-1 items-center bg-gray-100' : 'w-full px-3 py-2 text-left hover:bg-gray-100 flex gap-1 items-center'}
                  >
                    {isCurrentWorkspace ? <FaCheck color='green' /> : <Avatar text={workspace.name} size='w-6 h-6 text-[10px]' />}
                    {workspace.name}
                  </button>);
                })}
              </div>
              <div className="divide-y border-t ">
                <Link to='/dashboard/workspaces' className="flex cursor-pointer items-center gap-1 p-3 hover:bg-gray-100">
                  <img src="/assets/add-circle.svg" alt="" className="h-7 w-7" />
                  <span>Crear espacio de trabajo</span>
                </Link>
              </div>
            </div>
          </Button>
          {/* <Button text='Chat en vivo' handler={} /> */}
          <a href='/c/new'  className="flex cursor-pointer items-center gap-1 p-2 hover:bg-gray-100 hover:shadow rounded-md">
            <span>Chat</span>
          </a>

        </div>
        <div className='flex items-center gap-1'>
          <Button iconLeft={<MdNotifications size={25} />} text={data && data.invitations.length || '0'} handler={() => setOpen(!open)} />
          <Button text={user?.name} iconLeft={<Avatar text={user?.name} />} >
            <div className="w-[200px] ">
              <span className=" block p-3 text-gray-300 text-sm">Configuración</span>

              <div className="border-t ">
                <Link to='/dashboard/profile' className="flex cursor-pointer items-center gap-1 p-2 hover:bg-gray-100">
                  <FaUserCircle size={20} />
                  <span>Tu Configuración</span>
                </Link>

              </div>
            </div>

          </Button>
        </div>

      </header>

      {open && <div className='fixed w-full h-full bg-black/20 top-0 z-20 '>
        <div className='fixed z-20 top-0 right-0 h-full w-[300px] bg-white'>
          <div className='p-2 border-b-2 border-dashed flex items-center justify-between'>
            <h2>Notificaciones</h2>
            <button onClick={() => setOpen(!open)}><IoMdClose size={25} /></button>
          </div>
          <div className='bg-[#f4f5f6] h-full'>
            {
              data?.invitations.map(({ code, workspaceName }) => (
                <div key={code} className='flex items-start gap-2 p-2'>
                  <span className='w-10 h-10 rounded-full p-2 bg-[#49545a] flex items-center justify-center'>
                    <FaUsers size={30} color='white' />
                  </span>
                  <div className='flex flex-col gap-2'>
                    <span>¡Ha sido invitado a unirse al espacio de trabajo <strong>{workspaceName}</strong>!</span>
                    <Link to='/dashboard/workspaces' onClick={() => setOpen(!open)} className='bg-[#2589c6] text-white w-max p-2 rounded-lg '>Ver invitación</Link>
                  </div>

                </div>
              ))
            }
          </div>
        </div>
      </div>}
    </>
  );
}
