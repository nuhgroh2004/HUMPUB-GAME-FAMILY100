
import React, { useState, useEffect } from 'react';
import { GameState, Category, Team } from './types';
import EditorPage from './components/EditorPage';
import GamePage from './components/GamePage';

const STORAGE_KEY = 'trivia_game_data';

const DEFAULT_STATE: GameState = {
  categories: Array.from({ length: 5 }, (_, i) => ({
    id: `cat-${i}`,
    name: `Kategori ${i + 1}`,
    questions: Array.from({ length: 5 }, (_, j) => ({
      id: `q-${i}-${j}`,
      question: '',
      answer: '',
      isOpened: false
    }))
  })),
  teams: [
    { id: 't-1', name: 'Tim 1', score: 0 },
    { id: 't-2', name: 'Tim 2', score: 0 },
    { id: 't-3', name: 'Tim 3', score: 0 },
  ]
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'game' | 'editor'>('game');
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_STATE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const updateGameState = (newState: GameState) => {
    setGameState(newState);
  };

  const resetGameProgress = () => {
    const resetCategories = gameState.categories.map(cat => ({
      ...cat,
      questions: cat.questions.map(q => ({ ...q, isOpened: false }))
    }));
    const resetTeams = gameState.teams.map(t => ({ ...t, score: 0 }));
    setGameState({ ...gameState, categories: resetCategories, teams: resetTeams });
  };

  return (
    <div className="min-h-screen text-white flex flex-col">
      <nav className="bg-slate-900 border-b border-slate-700 p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-game text-yellow-400 tracking-wider">HUMPUB GAME</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentPage('game')}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                currentPage === 'game' 
                  ? 'bg-yellow-500 text-black shadow-lg scale-105' 
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              Main Game
            </button>
            <button
              onClick={() => setCurrentPage('editor')}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                currentPage === 'editor' 
                  ? 'bg-yellow-500 text-black shadow-lg scale-105' 
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              Edit Soal
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 p-6 overflow-auto">
        {currentPage === 'game' ? (
          <GamePage 
            gameState={gameState} 
            setGameState={updateGameState} 
            onReset={resetGameProgress}
          />
        ) : (
          <EditorPage 
            gameState={gameState} 
            setGameState={updateGameState} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
