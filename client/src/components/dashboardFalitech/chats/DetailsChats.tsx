import React from 'react';
import { Link, redirect, useNavigate, useParams } from 'react-router-dom';
import { useGetAllConversationForUser } from '../ReactQueryServices';
import { useAuthContext } from '~/hooks';
import { generateShareLink } from '../workspacesService';

export default function DetailsChats() {
  const { user } = useAuthContext();
  const { chatId } = useParams();  // Acceder al valor de 'chatId'
  const navigate = useNavigate();

  const { data, isLoading } = useGetAllConversationForUser(chatId, user?.id);

  // generateShareLink(chatId).then(x=> console.log(x));

  const RenderButton = ({ owner, conversation })=>{

    const handlerSharedLink = async () => {
      const { shareLink } = await generateShareLink(conversation.conversationId);
      navigate(shareLink);

    };

    if(owner){
      return (
        <Link to={conversation.link} target='_blank' className='rounded-md border bg-[#2791d1]/80 p-2 px-5 text-white transition-all hover:bg-[#2791d1] flex items-center gap-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:border-gray-100 disabled:text-gray-400'>
      Ver conversación
        </Link>
      );
    }

    return (
      <button onClick={handlerSharedLink} className='rounded-md border bg-[#2791d1]/80 p-2 px-5 text-white transition-all hover:bg-[#2791d1] flex items-center gap-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:border-gray-100 disabled:text-gray-400'>
        Ver conversación
      </button>
    );

  };

  console.log(data);

  return (
    <>
      <section className="w-full p-4">
        <div className='grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-2'>

          {
            !data && (
              <strong className='text-xs'>No hay conversaciones que mostrar</strong>
            )
          }

          {
            data && data.conversations.map(conversation => {
              return (
                <div key={conversation.conversationId} className='border p-2 flex flex-col items-center gap-1 rounded-lg shadow'>
                  <strong className='text-xs'>Conversación</strong>
                  <h2 className='text-center'>{conversation.title}</h2>
                  <strong className='text-xs'>IA</strong>
                  <h3 className='text-center'>{conversation.endpoint}</h3>
                  <strong className='text-xs'>Modelo</strong>
                  <h3 className='text-center'>{conversation.model}</h3>
                  <strong className='text-xs'>Ultima actualización</strong>
                  <h4 className='text-center'>{`${new Date(conversation.updatedAt).toLocaleDateString()} - ${new Date(conversation.updatedAt).toLocaleTimeString()}`}</h4>
                  <RenderButton conversation={conversation} owner={conversation.owner}  />
                  {/* <Link to={conversation.link} target='_blank' className='rounded-md border bg-[#2791d1]/80 p-2 px-5 text-white transition-all hover:bg-[#2791d1] flex items-center gap-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:border-gray-100 disabled:text-gray-400'>
                  Ver conversación
                  </Link> */}
                </div>
              );
            })
          }
        </div>
      </section>
    </>
  );
}
