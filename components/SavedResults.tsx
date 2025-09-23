import React from 'react';
import { SavedResult } from '../types';

interface SavedResultsProps {
  results: SavedResult[];
  onBack: () => void;
  onClear: () => void;
}

const SavedResults: React.FC<SavedResultsProps> = ({ results, onBack, onClear }) => {
  return (
    <div className="flex flex-col items-center w-full min-h-[50vh]">
      <h2 className="text-3xl font-bold mb-4 text-slate-800">Saved Results</h2>
      
      <div className="w-full flex-grow">
        {results.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500 mt-8 text-lg">No results have been saved yet.</p>
          </div>
        ) : (
          <div className="w-full mt-4">
            <div className="max-h-96 overflow-y-auto pr-2 border border-slate-200 rounded-lg p-2 bg-slate-50/50 space-y-2">
              {results.map(result => (
                <div key={result.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center gap-4">
                    <p className="font-bold text-lg text-slate-700">
                      Score: {result.score} / {result.total}
                      <span className="ml-4 font-semibold text-emerald-600">
                        {((result.score / result.total) * 100).toFixed(1)}%
                      </span>
                    </p>
                    <p className="text-sm text-slate-500 text-right flex-shrink-0">
                      {result.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <button 
                onClick={onClear} 
                className="text-sm text-red-500 hover:text-red-700 font-semibold transition-colors disabled:text-slate-400"
                disabled={results.length === 0}
              >
                Clear All Results
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 flex items-center justify-center w-full">
        <button
          onClick={onBack}
          className="px-8 py-4 bg-slate-600 text-white font-bold rounded-xl shadow-lg hover:bg-slate-700 transition-all duration-200 w-full sm:w-auto text-lg"
        >
          Back to Start
        </button>
      </div>
    </div>
  );
};

export default SavedResults;