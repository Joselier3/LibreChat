import React from 'react';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';

interface AsideProps {
  children: React.ReactNode
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  buttonVisible?: boolean
  MaxAndMinWidthOpen?: string
  MaxAndMinWidthClose?: string
}

export default function Aside({ children, open, setOpen, buttonVisible = true, MaxAndMinWidthOpen = 'min-w-52 max-w-52',MaxAndMinWidthClose='min-w-14 max-w-14' }:AsideProps) {

  return (
    <div className={`${open? MaxAndMinWidthOpen : MaxAndMinWidthClose } relative h-[calc(100vh-4rem)] border-r transition-all group`}>
      <ul className="flex flex-col flex-wrap">
        {children}
      </ul>
      {buttonVisible && (
        <button onClick={()=>setOpen(!open)} className={`absolute bottom-10 border -right-4 rounded-full flex items-center p-2 bg-[#d6f3ff] border-[#83e4ff] text-[#83e4ff] transition-all ${open ?'rotate-180' :'rotate-0'} opacity-0 group-hover:opacity-100`}>
          <MdOutlineKeyboardArrowRight size={15} />
        </button>
      )}
    </div>
  );
}
