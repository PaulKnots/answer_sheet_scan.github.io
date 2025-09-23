
import React from 'react';

const Loader: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6"></div>
      <h2 className="text-2xl font-semibold text-slate-700">{message}</h2>
      <p className="text-slate-500 mt-2">This may take a moment. Please wait.</p>
    </div>
  );
};

export default Loader;
