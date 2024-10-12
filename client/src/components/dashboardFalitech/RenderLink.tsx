import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

interface RenderLinkProps {
  text: string;
  href: string;
  open: boolean
  icon?: React.ReactNode;
}

export default function RenderLink({ text, href, icon, open }: RenderLinkProps) {
  const [showText, setShowText] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      setShowText(false);
      const timer = setTimeout(() => {
        setShowText(true);
      }, 100); // Delay for text visibility when opening
      return () => clearTimeout(timer);
    } else {
      setShowText(false); // Hide immediately when closing
    }
  }, [open]);
  return (
    <NavLink
      to={href}
      className={({ isActive }) => {
        return `h-12 transition-all flex items-center ${isActive ? 'bg-gray-100 text-[#0084ff]' : ''
        } hover:bg-gray-200 px-4 leading-[48px]`;
      }}
    >
      <div className="flex items-center justify-center gap-1 transition-all">
        <div>{icon && icon}</div>
        <span
          className={`transition-opacity duration-300 ${showText ? 'opacity-100' : 'opacity-0'
          } ${open ? 'block' : 'hidden'}`}
        >
          {text}
        </span>
      </div>
    </NavLink>
  );
}

