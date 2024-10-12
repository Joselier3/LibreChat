import React from 'react';

interface TableEsqueleton {
  rows?: number;
}

export default function TableEsqueleton({ rows = 3 }: TableEsqueleton) {
  const listRow = Array.from({ length: rows }, (v, i) => i);

  return (
    <div className="overflow-hidden rounded-md border shadow">
      <div className="w-full overflow-x-auto">
        <div className='"w-full animate-pulse border bg-gray-100 p-5'></div>
        {listRow.map((item) => (
          <div key={item} className="flex w-full items-center gap-2 p-2">
            <span className="w-full max-w-10 animate-pulse rounded-full border bg-gray-100 p-5"></span>
            <span className="w-full min-w-32 animate-pulse rounded-md border bg-gray-100 p-5"></span>
            <span className="w-full min-w-32 animate-pulse rounded-md border bg-gray-100 p-5"></span>
            <span className="w-full min-w-32 animate-pulse rounded-md border bg-gray-100 p-5"></span>
            <span className="w-full min-w-32 animate-pulse rounded-md border bg-gray-100 p-5"></span>
            <span className="w-full max-w-10 animate-pulse rounded-md border bg-gray-100 p-5"></span>
            <span className="w-full max-w-10 animate-pulse rounded-md border bg-gray-100 p-5"></span>
          </div>
        ))}
      </div>
    </div>
  );
}
