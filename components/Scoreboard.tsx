
import React from 'react';
import { GameState, Team } from '../types';

interface ScoreboardProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ gameState, setGameState }) => {
  const updateScore = (teamId: string, amount: number) => {
    const newTeams = gameState.teams.map((t) =>
      t.id === teamId ? { ...t, score: Math.max(0, t.score + amount) } : t
    );
    setGameState({ ...gameState, teams: newTeams });
  };

  const updateTeamName = (teamId: string, name: string) => {
    const newTeams = gameState.teams.map((t) =>
      t.id === teamId ? { ...t, name } : t
    );
    setGameState({ ...gameState, teams: newTeams });
  };

  const addTeam = () => {
    const nextId = gameState.teams.length + 1;
    if (gameState.teams.length >= 6) return alert('Maksimal 6 tim');
    const newTeam: Team = {
      id: `t-${Date.now()}`,
      name: `Tim ${nextId}`,
      score: 0
    };
    setGameState({ ...gameState, teams: [...gameState.teams, newTeam] });
  };

  const removeTeam = (id: string) => {
    if (gameState.teams.length <= 1) return;
    setGameState({
        ...gameState,
        teams: gameState.teams.filter(t => t.id !== id)
    });
  }

  return (
    <div className="mt-4 bg-slate-900 border-t-2 border-yellow-500 p-3 md:p-4 shadow-2xl z-40">
      <div className="max-w-full mx-auto flex items-center justify-center gap-2 md:gap-4 flex-wrap">
        {gameState.teams.map((team) => (
          <div key={team.id} className="group relative">
            <div className="bg-slate-800 border border-slate-700 rounded-xl w-32 md:w-44 lg:w-48 flex flex-col p-2 transition-all group-hover:border-blue-500 shadow-md">
              <button 
                onClick={() => removeTeam(team.id)}
                className="absolute -top-1 -right-1 bg-red-600 rounded-full w-5 h-5 text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                ✕
              </button>
              <input
                type="text"
                value={team.name}
                onChange={(e) => updateTeamName(team.id, e.target.value)}
                className="bg-transparent text-center font-bold text-xs md:text-sm mb-1 text-yellow-300 border-b border-transparent focus:border-yellow-500 outline-none uppercase truncate"
                placeholder="Nama Tim"
              />
              <div className="text-center font-game text-xl md:text-3xl text-white mb-2 drop-shadow-sm">
                {team.score}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => updateScore(team.id, -100)}
                  className="flex-1 bg-red-900/30 hover:bg-red-800 text-[10px] md:text-xs font-bold py-1 rounded transition-colors border border-red-900"
                >
                  -100
                </button>
                <button
                  onClick={() => updateScore(team.id, 100)}
                  className="flex-1 bg-green-900/30 hover:bg-green-800 text-[10px] md:text-xs font-bold py-1 rounded transition-colors border border-green-900"
                >
                  +100
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addTeam}
          className="h-20 w-10 md:h-24 md:w-12 bg-slate-800 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center hover:bg-slate-700 hover:border-yellow-500 transition-all text-slate-500 hover:text-yellow-400 group"
        >
          <span className="text-2xl transform group-hover:scale-125 transition-transform">+</span>
        </button>
      </div>
    </div>
  );
};

export default Scoreboard;
