import React, { useState, useMemo } from 'react';
import { Answers } from '../types';

interface AnswerKeyEntryProps {
  onComplete: (key: Answers) => void;
  initialKey: Answers;
  totalQuestions: number;
  onShowSaved: () => void;
}

const AnswerOption: React.FC<{
  option: string;
  isSelected: boolean;
  onClick: () => void;
}> = ({ option, isSelected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-10 h-10 flex items-center justify-center rounded-lg font-mono text-sm transition-all duration-200
      ${isSelected
        ? 'bg-emerald-500 text-white scale-110 shadow-lg'
        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
      }`}
  >
    {option}
  </button>
);


const AnswerKeyEntry: React.FC<AnswerKeyEntryProps> = ({ onComplete, initialKey, totalQuestions, onShowSaved }) => {
  const [key, setKey] = useState<Answers>(initialKey);

  const handleSelect = (question: string, answer: string) => {
    setKey(prev => ({ ...prev, [question]: answer }));
  };
  
  const isComplete = useMemo(() => {
    const filledCount = Object.values(key).filter(val => val).length;
    return filledCount === totalQuestions;
  }, [key, totalQuestions]);

  const handleSubmit = () => {
    if (isComplete) {
      onComplete(key);
    }
  };

  const renderQuestionGrid = () => {
    const columns = 4;
    const questionsPerColumn = Math.ceil(totalQuestions / columns);
    const grid = Array.from({ length: columns }, (_, colIndex) =>
      Array.from({ length: questionsPerColumn }, (_, rowIndex) => {
        const questionNumber = colIndex * questionsPerColumn + rowIndex + 1;
        return questionNumber <= totalQuestions ? questionNumber : null;
      })
    );

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
        {grid.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col space-y-3">
            {column.map(qNum =>
              qNum ? (
                <div key={qNum} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50">
                  <span className="font-bold text-slate-600 w-8">{qNum}.</span>
                  <div className="flex gap-2">
                    {['A', 'B', 'C', 'D', 'E'].map(opt => (
                      <AnswerOption
                        key={opt}
                        option={opt}
                        isSelected={key[qNum.toString()] === opt}
                        onClick={() => handleSelect(qNum.toString(), opt)}
                      />
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </div>
        ))}
      </div>
    );
  };


  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-1 text-slate-700">Set Answer Key</h2>
      <p className="text-slate-500 mb-6">Enter the correct answer for each question.</p>
      
      {renderQuestionGrid()}

      <div className="mt-8 w-full flex flex-col items-center">
        <p className="mb-4 text-sm text-slate-500">
          {Object.values(key).filter(val => val).length} / {totalQuestions} answers set.
        </p>
        <button
          onClick={handleSubmit}
          disabled={!isComplete}
          className="w-full max-w-xs px-8 py-4 bg-emerald-500 text-white font-bold rounded-xl shadow-md
            hover:bg-emerald-600 transition-all duration-200 disabled:bg-slate-300 disabled:cursor-not-allowed
            disabled:shadow-none flex items-center justify-center gap-2"
        >
           <svg xmlns="http://www.w.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4zm0 2c1.11 0 2 .89 2 2v2H10V6c0-1.11.89-2 2-2z" />
            </svg>
          Lock Key & Start Scanning
        </button>
        <button
          onClick={onShowSaved}
          className="mt-4 text-slate-500 hover:text-slate-700 font-semibold text-sm transition-colors"
        >
          View Saved Results
        </button>
      </div>
    </div>
  );
};

export default AnswerKeyEntry;