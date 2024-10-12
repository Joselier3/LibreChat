import React, { useEffect, useRef, useState } from 'react';

interface ButtonProps {
  children?: React.ReactNode;
  handler?: () => void;
  buttonImage?: string;
  text?: string;
  className?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  type?: 'button' | 'reset' | 'submit' | undefined;
}

export default function Button({
  children,
  handler,
  iconLeft,
  iconRight,
  text,
  loading,
  className,
  type = 'button',
}: ButtonProps) {
  const [open, setOpen] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    if (open && modalRef.current) {
      const dropdownRect = modalRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      if (dropdownRect.right > viewportWidth) {
        modalRef.current.style.left = 'auto';
        modalRef.current.style.right = '0';
      } else if (dropdownRect.left < 0) {
        modalRef.current.style.left = '0';
        modalRef.current.style.right = 'auto';
      }
    }
  }, [open]);

  const handlerClick = () => {
    setOpen((prev) => !prev);
    handler && handler();
  };

  if (loading) {
    return (
      <div
        className={`${className} flex w-48 animate-pulse items-center rounded-lg bg-gray-200 p-4 shadow`}
      ></div>
    );
  }

  return (
    <div className="group relative" ref={modalRef}>
      <button
        ref={buttonRef}
        type={type}
        onClick={handlerClick}
        className="flex items-center gap-2 rounded-lg p-1 px-2 hover:bg-[#edeeee] hover:shadow"
      >
        {iconLeft && iconLeft}
        {text && <span className="font-bold text-black/70 group-hover:text-black/50">{text}</span>}
        {iconRight && iconRight}

        {children && (
          <img
            src="/assets/arrow-down.svg"
            alt=""
            className="h-4 w-4 text-black/70 group-hover:text-black/50"
          />
        )}
      </button>
      {open && (
        <div  ref={modalRef} className="absolute z-10 left-0 top-12 w-max rounded-md border bg-white shadow">
          {children}
        </div>
      )}
    </div>
  );
}
