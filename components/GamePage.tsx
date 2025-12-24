
import React, { useState } from 'react';
import { GameState, Category, QuestionCell } from '../types';
import Scoreboard from './Scoreboard';

interface GamePageProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  onReset: () => void;
}

const GamePage: React.FC<GamePageProps> = ({ gameState, setGameState, onReset }) => {
  const [activeQuestion, setActiveQuestion] = useState<{ catIdx: number; qIdx: number } | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const openQuestion = (catIdx: number, qIdx: number) => {
    const q = gameState.categories[catIdx].questions[qIdx];
    if (q.isOpened || !q.question) return;
    setActiveQuestion({ catIdx, qIdx });
    setShowAnswer(false);
  };

  const closeQuestion = () => {
    if (!activeQuestion) return;
    const { catIdx, qIdx } = activeQuestion;
    const newCats = [...gameState.categories];
    const newQuestions = [...newCats[catIdx].questions];
    newQuestions[qIdx] = { ...newQuestions[qIdx], isOpened: true };
    newCats[catIdx] = { ...newCats[catIdx], questions: newQuestions };
    setGameState({ ...gameState, categories: newCats });
    setActiveQuestion(null);
  };

  const columnCount = gameState.categories.length;

  return (
    <div className="max-w-full mx-auto h-full flex flex-col overflow-hidden">
      <div className="flex justify-end mb-2">
          <button 
            onClick={onReset}
            className="bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-400 px-3 py-1 rounded text-xs transition-colors border border-slate-700"
          >
            Reset Progress
          </button>
      </div>

      <div className="flex-1 w-full flex flex-col min-h-0">
        <div 
          className="grid gap-2 md:gap-4 h-full"
          style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
        >
          {gameState.categories.map((cat, catIdx) => (
            <div key={cat.id} className="flex flex-col gap-2 md:gap-4 h-full">
              {/* Category Header */}
              <div className="bg-blue-900 border-2 border-blue-600 p-2 h-16 md:h-20 flex items-center justify-center text-center rounded-lg shadow-lg">
                <span className="font-game text-xs md:text-sm lg:text-base text-yellow-400 drop-shadow-md uppercase line-clamp-2">
                  {cat.name}
                </span>
              </div>
              
              {/* Questions in Column */}
              <div className="flex-1 grid grid-rows-5 gap-2 md:gap-4">
                {cat.questions.map((q, qIdx) => (
                  <button
                    key={q.id}
                    disabled={q.isOpened || !q.question}
                    onClick={() => openQuestion(catIdx, qIdx)}
                    className={`rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                      q.isOpened 
                        ? 'bg-slate-900/50 border-slate-800 text-slate-700 opacity-40 grayscale'
                        : !q.question
                          ? 'bg-slate-900/30 border-slate-800 opacity-10'
                          : 'bg-blue-800 border-blue-500 hover:scale-[1.02] hover:bg-blue-700 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                    }`}
                  >
                    <span className={`font-game text-xl md:text-2xl lg:text-4xl tracking-tighter md:tracking-widest ${q.isOpened ? 'text-slate-800' : 'text-yellow-400'}`}>
                      {(qIdx + 1) * 100}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Scoreboard gameState={gameState} setGameState={setGameState} />

      {activeQuestion && (
        <div className="fixed inset-0 bg-[#000033] flex items-center justify-center p-4 z-[100]">
          <div className="max-w-5xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="space-y-4">
              <span className="text-blue-400 font-game tracking-widest text-lg md:text-xl">
                {gameState.categories[activeQuestion.catIdx].name} - {(activeQuestion.qIdx + 1) * 100} POIN
              </span>
              <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white leading-tight drop-shadow-lg p-6 md:p-10 bg-blue-900/20 rounded-3xl border border-blue-500/30">
                {gameState.categories[activeQuestion.catIdx].questions[activeQuestion.qIdx].question}
              </h2>
            </div>

            {showAnswer && (
              <div className="animate-in slide-in-from-bottom-8 duration-500">
                <div className="h-px bg-yellow-500/50 w-32 md:w-64 mx-auto mb-6"></div>
                <h3 className="text-2xl md:text-4xl lg:text-6xl font-game text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                  {gameState.categories[activeQuestion.catIdx].questions[activeQuestion.qIdx].answer}
                </h3>
              </div>
            )}

            <div className="flex gap-4 justify-center pt-4">
              {!showAnswer ? (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-game text-xl md:text-2xl px-8 md:px-12 py-3 md:py-5 rounded-full transition-all hover:scale-105"
                >
                  LIHAT JAWABAN
                </button>
              ) : (
                <button
                  onClick={closeQuestion}
                  className="bg-red-600 hover:bg-red-500 text-white font-game text-xl md:text-2xl px-8 md:px-12 py-3 md:py-5 rounded-full transition-all hover:scale-105"
                >
                  KEMBALI KE PAPAN
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;
