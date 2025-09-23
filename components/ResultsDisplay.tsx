import React, { useState } from 'react';
import { GradedResult } from '../types';

interface ResultsDisplayProps {
  result: GradedResult;
  onScanAnother: () => void;
  onChangeKey: () => void;
  onSave: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onScanAnother, onChangeKey, onSave }) => {
  const { score, total, details } = result;
  const [isSaved, setIsSaved] = useState(false);
  const percentage = total > 0 ? ((score / total) * 100).toFixed(1) : 0;

  const getCellClass = (isCorrect: boolean) => {
    return isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800';
  };
  
  const getBorderClass = (isCorrect: boolean) => {
    return isCorrect ? 'border-emerald-200' : 'border-red-200';
  }
  
  const handleSave = () => {
    onSave();
    setIsSaved(true);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-3xl font-bold mb-2 text-slate-800">Grading Complete</h2>
      
      <div className="my-6 w-full max-w-sm bg-slate-100 p-8 rounded-2xl shadow-inner text-center">
        <p className="text-slate-500 font-medium text-lg">Total Score</p>
        <p className="text-7xl font-bold text-emerald-600 my-2">
          {score}<span className="text-4xl text-slate-400 font-normal"> / {total}</span>
        </p>
        <p className="text-2xl font-semibold text-slate-600">{percentage}%</p>
      </div>

      <div className="w-full mt-4">
        <h3 className="text-xl font-bold mb-4 text-slate-700 text-center">Detailed Results</h3>
        <div className="max-h-96 overflow-y-auto pr-2 border border-slate-200 rounded-lg p-2 bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {Object.entries(details).sort(([a], [b]) => parseInt(a) - parseInt(b)).map(([qNum, detail]) => (
              <div
                key={qNum}
                className={`flex items-center justify-between p-3 rounded-lg border ${getBorderClass(detail.isCorrect)} ${getCellClass(detail.isCorrect)}`}
              >
                <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${detail.isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                        {detail.isCorrect ? '✔' : '✖'}
                    </span>
                    <span className="font-bold">Q{qNum}</span>
                </div>
                <div className="text-sm font-mono">
                  {detail.isCorrect ? (
                    <span>Correct: <span className="font-bold">{detail.correctAnswer}</span></span>
                  ) : (
                    <span>
                      Yours: <span className="font-bold line-through">{detail.studentAnswer}</span>,
                      Key: <span className="font-bold">{detail.correctAnswer}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center w-full gap-4 flex-wrap">
        <button
          onClick={onChangeKey}
          className="px-6 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl shadow-md hover:bg-slate-300 transition-all duration-200 w-full sm:w-auto"
        >
          Change Answer Key
        </button>
        <button
          onClick={handleSave}
          disabled={isSaved}
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-xl shadow-md hover:bg-blue-600 transition-all duration-200 w-full sm:w-auto disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          {isSaved ? '✓ Saved' : 'Save Result'}
        </button>
        <button
          onClick={onScanAnother}
          className="px-8 py-4 bg-emerald-500 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-600 transition-all duration-200 w-full sm:w-auto text-lg"
        >
          Scan Another Sheet
        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;