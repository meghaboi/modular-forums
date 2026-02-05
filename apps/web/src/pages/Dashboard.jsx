import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [matches, setMatches] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMatches = async () => {
      const { data } = await api.get('/matches');
      setMatches(data);
    };
    fetchMatches();
  }, []);

  const updateScore = async (id, scoreA, scoreB, status) => {
    try {
      await api.patch(`/matches/${id}`, { scoreA, scoreB, status });
      setMatches(prev => prev.map(m => m.id === id ? { ...m, scoreA, scoreB, status } : m));
    } catch (err) {
      alert('Failed to update match');
    }
  };

  if (!user || (user.role !== 'ADMIN' && user.role !== 'REPORTER')) {
    return <div className="p-20 text-center font-bold uppercase text-red-500">Access Denied</div>;
  }

  return (
    <div className="p-4 flex flex-col gap-6">
      <h1 className="text-2xl font-bold uppercase tracking-tighter italic text-red-600">Slasher Dashboard</h1>
      <div className="bg-charcoal-800 border border-charcoal-700">
        <div className="bg-charcoal-700/50 px-3 py-1 text-[11px] font-bold text-gray-300 tracking-wider border-b border-charcoal-700 uppercase">Manage Matches</div>
        <div className="flex flex-col">
          {matches.map(match => (
            <div key={match.id} className="flex flex-col md:flex-row items-center justify-between p-4 border-b border-charcoal-700 gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-bold">{match.teamA} vs {match.teamB}</span>
                <span className="text-[10px] text-gray-500 uppercase">{match.status}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    className="w-12 bg-charcoal-900 border border-charcoal-700 p-1 text-center text-xs" 
                    defaultValue={match.scoreA} 
                    id={`scoreA-${match.id}`}
                  />
                  <span>:</span>
                  <input 
                    type="number" 
                    className="w-12 bg-charcoal-900 border border-charcoal-700 p-1 text-center text-xs" 
                    defaultValue={match.scoreB}
                    id={`scoreB-${match.id}`}
                  />
                </div>
                <select 
                  className="bg-charcoal-900 border border-charcoal-700 p-1 text-xs" 
                  defaultValue={match.status}
                  id={`status-${match.id}`}
                >
                  <option value="UPCOMING">UPCOMING</option>
                  <option value="LIVE">LIVE</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
                <button 
                  onClick={() => {
                    const sA = parseInt(document.getElementById(`scoreA-${match.id}`).value);
                    const sB = parseInt(document.getElementById(`scoreB-${match.id}`).value);
                    const st = document.getElementById(`status-${match.id}`).value;
                    updateScore(match.id, sA, sB, st);
                  }}
                  className="bg-white text-black px-3 py-1 text-[10px] font-bold uppercase hover:bg-gray-200 transition-colors"
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
