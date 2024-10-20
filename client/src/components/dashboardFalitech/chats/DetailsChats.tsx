import React, { useState } from 'react';
import { Link, redirect, useNavigate, useParams } from 'react-router-dom';
import { useGetAllConversationForUser } from '../ReactQueryServices';
import { useAuthContext } from '~/hooks';
import { generateShareLink } from '../workspacesService';
import TableEsqueleton from '../TableEsqueleton';
import { IoEyeOutline } from 'react-icons/io5';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { useWorkspace } from '../workspaceContext';
import { TbEye, TbEyeEdit } from 'react-icons/tb';

export default function DetailsChats() {
  const { user } = useAuthContext();
  const { selectedWorkspace, selectWorkspace } = useWorkspace();
  const { chatId } = useParams();  // Acceder al valor de 'chatId'
  const navigate = useNavigate();

  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError } = useGetAllConversationForUser(
    chatId,
    user?.id,
    selectedWorkspace?._id,
    pageNumber,
    pageSize,
  );

  // Maneja el cambio de página
  const handleNextPage = () => {
    setPageNumber((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber((prevPage) => prevPage - 1);
    }
  };

  const RenderButton = ({ owner, conversation }) => {

    const handlerSharedLink = async () => {
      const { shareLink } = await generateShareLink(conversation.conversationId);
      navigate(shareLink);

    };

    if (owner) {
      return (
        <a href={conversation.link} className='rounded-md border bg-[#2791d1]/80 p-2 text-white transition-all hover:bg-[#2791d1] flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:border-gray-100 disabled:text-gray-400 '>
          <TbEyeEdit  size={25} />
        </a>
      );
    }

    return (
      <button onClick={handlerSharedLink} className='rounded-md border bg-[#2791d1]/80 p-2 text-white transition-all hover:bg-[#2791d1] flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:border-gray-100 disabled:text-gray-400'>
        <TbEye size={25} />
      </button>
    );

  };

  if (isLoading) {
    return  <section className="w-full p-4"><TableEsqueleton rows={4} /></section>;
  }

  if(!data && !data?.conversations.length){
    return <div className='p-4'>No hay conversaciones</div>;
  }

  if (isError) {
    return <div className='p-4'>Error al cargar las conversaciones.</div>;
  }

  return (
    <>
      <section className="w-full p-4">
        <div className=''>
          {isLoading && <TableEsqueleton rows={4} />}
          {
            !isLoading && (
              <div className="overflow-hidden rounded-md border shadow">
                <h2 className="p-4">Conversaciones de {user?.name}</h2>
                <div className="w-full overflow-x-auto whitespace-nowrap reset-scrollbar">
                  <table className="w-full overflow-x-auto border">
                    <thead className="border">
                      <tr className="bg-[#e6ecf0]">
                        <th className="p-3 text-left text-gray-500">Conversación</th>
                        <th className="p-3 text-left text-gray-500">IA</th>
                        <th className="p-3 text-left text-gray-500">Modelo</th>
                        <th className="p-3 text-left text-gray-500">Actualización</th>
                        <th className="p-3 text-left text-gray-500">&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y ">
                      {data &&
                        data.conversations.map((conversation) => {

                          return (
                            <tr key={conversation?.conversationId}>
                              <td className="p-3">
                                <div>{conversation.title}</div>
                              </td>
                              <td className="p-3">
                                <div>{conversation.endpoint}</div>
                              </td>
                              <td className="p-3">
                                <div>
                                  <div>{conversation.model}</div>
                                </div>
                              </td>
                              <td className="p-3">
                                <div>
                                  <div>{`${new Date(conversation.updatedAt).toLocaleDateString()} - ${new Date(conversation.updatedAt).toLocaleTimeString()}`}</div>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="badge badge-light">
                                  <RenderButton conversation={conversation} owner={conversation.owner} />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          }
          <div className='flex items-center justify-between gap-1 py-2'>
            <span>Pagina {data?.currentPage} de {data?.totalPages}</span>
            <div className='flex items-center gap-2'>
              <button
                onClick={handlePreviousPage}
                disabled={pageNumber === 1}
                className={`px-4 py-2 rounded-md font-medium text-white flex items-center gap-1 ${pageNumber === 1
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[#2791d1]/80 hover:[#2791d1]'
                }`}
              >
                <IoIosArrowBack />
                Anterior
              </button>
              <button
                onClick={handleNextPage}
                disabled={data.totalPages && pageNumber >= data.totalPages}
                className={`px-4 py-2 rounded-md font-medium text-white flex items-center gap-1 ${data.totalPages && pageNumber >= data.totalPages
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[#2791d1]/80 hover:[#2791d1]'
                }`}
              >
                Siguiente
                <IoIosArrowForward />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
