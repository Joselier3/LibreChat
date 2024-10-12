import React, { useState } from 'react';

import { Outlet } from 'react-router-dom';
import Aside from '../aside';
import Dropdwon from '../Dropdwon';
import { SiOpenai } from 'react-icons/si';
import RenderLink from '../RenderLink';

export default function Integrations() {

  const [open, setOpen] = useState<boolean>(true);

  return (
    <>
      <section className='flex'>

        <Aside open={true} setOpen={setOpen} buttonVisible={false}>

          <Dropdwon text='Inteligencia artificial'>
            <RenderLink open={true} text="OpenAI" href="openai" icon={<SiOpenai color='#000' />} />
            <RenderLink open={true} text="Assistants" href="assistants" icon={<SiOpenai color='#000' />} />
          </Dropdwon>

        </Aside>

        <div className="h-[calc(100vh-4rem)] w-full overflow-auto reset-scrollbar">
          <Outlet />
        </div>

      </section>
    </>
  );
}
