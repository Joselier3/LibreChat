import React, { useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';

interface DropdwonProps {
  children: React.ReactNode
  text: string
}

export default function Dropdwon({ children, text = 'DefaultText' }:DropdwonProps) {
  const [state,setState] = useState<boolean>(true);
  return (
    <div>
      <button onClick={()=>setState(!state)} className='gap-1 p-3 w-full  hover:bg-gray-100 '>
        <div className='flex items-center justify-between hover:scale-95 active:scale-100 transition-all'>
          <span>{text}</span>
          <span className={`${state ? 'rotate-180' : ''} transition-all`}>     <MdKeyboardArrowDown size={20} />
          </span>
        </div>
      </button>
      <div className={`overflow-hidden transition-all ${state ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
}
