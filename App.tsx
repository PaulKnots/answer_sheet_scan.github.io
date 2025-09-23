
import React, { useState, useCallback } from 'react';
import { AppState, Answers, GradedResult } from './types';
import { extractAnswersFromImage } from './services/geminiService';
import AnswerKeyEntry from './components/AnswerKeyEntry';
import CameraView from './components/CameraView';
import ResultsDisplay from './components/ResultsDisplay';
import Header from './components/Header';
import Loader from './components/Loader';

const TOTAL_QUESTIONS = 60;

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.KEY_ENTRY);
  const [answerKey, setAnswerKey] = useState<Answers>({});
  const [studentAnswers, setStudentAnswers] = useState<Answers | null>(null);
  const [gradedResult, setGradedResult] = useState<GradedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleKeyComplete = (key: Answers) => {
    setAnswerKey(key);
    setAppState(AppState.SCANNING);
    setError(null);
  };

  const gradeAnswers = useCallback((sAnswers: Answers, aKey: Answers): GradedResult => {
    let score = 0;
    const details: GradedResult['details'] = {};
    for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
      const question = i.toString();
      const studentAnswer = sAnswers[question];
      const correctAnswer = aKey[question];
      const isCorrect = studentAnswer === correctAnswer && studentAnswer !== 'BLANK';
      if (isCorrect) {
        score++;
      }
      details[question] = {
        studentAnswer: studentAnswer || 'BLANK',
        correctAnswer: correctAnswer || 'BLANK',
        isCorrect,
      };
    }
    return { score, total: TOTAL_QUESTIONS, details };
  }, []);

  const handleCapture = async (imageDataUrl: string) => {
    setAppState(AppState.GRADING);
    setIsLoading(true);
    setError(null);
    try {
      const extractedAnswers = await extractAnswersFromImage(imageDataUrl);
      if (Object.keys(extractedAnswers).length === 0) {
        throw new Error("Could not read the answer sheet. Please try again with a clearer image.");
      }
      setStudentAnswers(extractedAnswers);
      const result = gradeAnswers(extractedAnswers, answerKey);
      setGradedResult(result);
      setAppState(AppState.RESULTS);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during grading.";
      setError(errorMessage);
      setAppState(AppState.SCANNING); // Go back to scanning
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanAnother = () => {
    setStudentAnswers(null);
    setGradedResult(null);
    setError(null);
    setAppState(AppState.SCANNING);
  };

  const handleChangeKey = () => {
    setStudentAnswers(null);
    setGradedResult(null);
    setError(null);
    setAppState(AppState.KEY_ENTRY);
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loader message="Analyzing and Grading..." />;
    }

    switch (appState) {
      case AppState.KEY_ENTRY:
        return <AnswerKeyEntry onComplete={handleKeyComplete} initialKey={answerKey} totalQuestions={TOTAL_QUESTIONS} />;
      case AppState.SCANNING:
        return <CameraView onCapture={handleCapture} onBack={handleChangeKey} error={error} />;
      case AppState.GRADING:
         return <Loader message="Analyzing and Grading..." />;
      case AppState.RESULTS:
        return gradedResult && <ResultsDisplay result={gradedResult} onScanAnother={handleScanAnother} onChangeKey={handleChangeKey} />;
      default:
        return <div>Invalid state</div>;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 flex flex-col items-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-6 bg-white rounded-2xl shadow-lg p-4 sm:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
