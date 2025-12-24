
import React, { useState } from 'react';
import { GameState, Category, QuestionCell } from '../types';

interface EditorPageProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
}

const EditorPage: React.FC<EditorPageProps> = ({ gameState, setGameState }) => {
  const [editingCell, setEditingCell] = useState<{ catIdx: number; qIdx: number } | null>(null);

  const addColumn = () => {
    const newCatCount = gameState.categories.length + 1;
    if (newCatCount > 8) return alert('Maksimal 8 kategori agar tetap rapi');
    const rowCount = gameState.categories[0].questions.length;
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: `Kategori ${newCatCount}`,
      questions: Array.from({ length: rowCount }, (_, i) => ({
        id: `q-${Date.now()}-${i}`,
        question: '',
        answer: '',
        isOpened: false
      }))
    };
    setGameState({ ...gameState, categories: [...gameState.categories, newCategory] });
  };

  const addRow = () => {
    const updatedCategories = gameState.categories.map((cat) => ({
      ...cat,
      questions: [
        ...cat.questions,
        {
          id: `q-${cat.id}-${Date.now()}`,
          question: '',
          answer: '',
          isOpened: false
        }
      ]
    }));
    setGameState({ ...gameState, categories: updatedCategories });
  };

  const updateCategoryName = (idx: number, name: string) => {
    const newCats = [...gameState.categories];
    newCats[idx] = { ...newCats[idx], name };
    setGameState({ ...gameState, categories: newCats });
  };

  const saveCell = (question: string, answer: string) => {
    if (!editingCell) return;
    const { catIdx, qIdx } = editingCell;
    const newCats = [...gameState.categories];
    const newQuestions = [...newCats[catIdx].questions];
    newQuestions[qIdx] = { ...newQuestions[qIdx], question, answer };
    newCats[catIdx] = { ...newCats[catIdx], questions: newQuestions };
    setGameState({ ...gameState, categories: newCats });
    setEditingCell(null);
  };

  const clearData = () => {
    if(confirm('Hapus semua data soal?')) {
        setGameState({
            ...gameState,
            categories: gameState.categories.map(c => ({
                ...c,
                questions: c.questions.map(q => ({...q, question: '', answer: '', isOpened: false}))
            }))
        });
    }
  }

  const columnCount = gameState.categories.length;

  return (
    <div className="w-full mx-auto h-full flex flex-col overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold text-yellow-400">Editor Board</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={addColumn} className="bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded text-sm font-semibold">+ Kategori</button>
          <button onClick={addRow} className="bg-green-600 hover:bg-green-500 px-3 py-1.5 rounded text-sm font-semibold">+ Baris</button>
          <button onClick={clearData} className="bg-red-600 hover:bg-red-500 px-3 py-1.5 rounded text-sm font-semibold">Reset Soal</button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div 
          className="grid gap-2 h-full"
          style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
        >
          {gameState.categories.map((cat, catIdx) => (
            <div key={cat.id} className="flex flex-col gap-2">
              <input
                type="text"
                value={cat.name}
                onChange={(e) => updateCategoryName(catIdx, e.target.value)}
                className="bg-slate-800 border-2 border-slate-700 p-2 rounded font-bold text-center text-yellow-300 focus:border-yellow-500 outline-none text-xs md:text-sm"
                placeholder="Kategori"
              />
              <div className="flex-1 grid gap-2" style={{ gridTemplateRows: `repeat(${cat.questions.length}, 1fr)` }}>
                {cat.questions.map((q, qIdx) => (
                  <button
                    key={q.id}
                    onClick={() => setEditingCell({ catIdx, qIdx })}
                    className={`rounded border-2 p-1 flex flex-col items-center justify-center transition-all min-h-[60px] ${
                      q.question ? 'bg-blue-900/40 border-blue-400' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <span className="text-[10px] text-slate-500 mb-0.5">{(qIdx + 1) * 100}</span>
                    <span className="text-[10px] md:text-xs line-clamp-2 text-center overflow-hidden leading-tight">
                      {q.question || <span className="text-slate-600 italic">Isi</span>}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingCell && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[120] backdrop-blur-sm">
          <div className="bg-slate-900 border-2 border-yellow-500 p-6 md:p-8 rounded-2xl w-full max-w-2xl shadow-2xl">
            <h3 className="text-xl md:text-2xl font-game text-yellow-400 mb-4 md:mb-6">Edit Soal & Jawaban</h3>
            <div className="space-y-4 md:space-y-6">
              <div>
                <label className="block text-slate-400 mb-1 text-sm font-semibold">Pertanyaan</label>
                <textarea
                  className="w-full h-24 md:h-32 bg-slate-800 border border-slate-700 rounded p-3 text-sm md:text-base text-white focus:ring-2 focus:ring-yellow-500 outline-none resize-none"
                  defaultValue={gameState.categories[editingCell.catIdx].questions[editingCell.qIdx].question}
                  id="edit-q"
                  placeholder="Ketik pertanyaan..."
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 text-sm font-semibold">Jawaban Benar</label>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-sm md:text-base text-white focus:ring-2 focus:ring-yellow-500 outline-none"
                  defaultValue={gameState.categories[editingCell.catIdx].questions[editingCell.qIdx].answer}
                  id="edit-a"
                  placeholder="Ketik jawaban..."
                />
              </div>
              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => {
                    const q = (document.getElementById('edit-q') as HTMLTextAreaElement).value;
                    const a = (document.getElementById('edit-a') as HTMLInputElement).value;
                    saveCell(q, a);
                  }}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 md:py-3 rounded-xl transition-colors"
                >
                  Simpan
                </button>
                <button
                  onClick={() => setEditingCell(null)}
                  className="px-6 md:px-8 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 md:py-3 rounded-xl transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorPage;
