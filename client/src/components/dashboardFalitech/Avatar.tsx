import React from 'react';

interface avatarProps {
  img?: string;
  text?: string;
  loading?: boolean;
  size?: string
}

export default function Avatar({ img, text, loading, size='h-9 w-9' }: avatarProps) {
  if (loading) {
    return (
      <div className={`flex ${size} animate-pulse items-center rounded-full bg-gray-200 p-3`}></div>
    );
  }

  if (img) {
    return <img src={img} alt="Foto del equipo" className={size} />;
  }

  if (text) {
    return (
      <span className={`flex ${size} items-center justify-center rounded-full bg-[#937129] p-3 text-white`}>
        {text.slice(0, 2).toUpperCase()}
      </span>
    );
  }
}
