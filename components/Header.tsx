
import React from 'react';

const DocumentScannerIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M6 4h12v1H6zM6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm1 14h10v1H7zM7 13h10v-1H7zM7 9h10V8H7z" />
    </svg>
);


const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="flex items-center justify-center gap-4 mb-2">
        <DocumentScannerIcon className="w-10 h-10 text-emerald-500" />
        <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
          OMR Sheet Grader
        </h1>
      </div>
      <p className="text-slate-500 text-lg">
        Instantly grade multiple-choice tests with your camera.
      </p>
    </header>
  );
};

export default Header;
