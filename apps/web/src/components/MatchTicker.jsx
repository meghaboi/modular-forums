import { useEffect, useState } from 'react';
import api from '../lib/api';
import { io } from 'socket.io-client';

const MatchTicker = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const { data } = await api.get('/matches');
        setMatches(data);
      } catch (err) {
        console.error('Failed to fetch matches');
      }
    };
    fetchMatches();

    const socket = io('http://localhost:4000');
    socket.on('match_update', (updatedMatch) => {
      setMatches(prev => prev.map(m => m.id === updatedMatch.id ? updatedMatch : m));
    });

    return () => socket.disconnect();
  }, []);

  const liveMatches = matches.filter(m => m.status === 'LIVE');

  return (
    <div className="bg-charcoal-900 border-b border-charcoal-700 h-10 overflow-hidden flex items-center">
      <div className="bg-red-600 text-white text-[10px] font-bold px-2 h-full flex items-center shrink-0 tracking-tighter uppercase">Funding & Events</div>
      <div className="flex gap-0 overflow-x-auto no-scrollbar items-center h-full">
        {liveMatches.length > 0 ? liveMatches.map(match => (
          <div key={match.id} className="flex items-center h-full px-4 border-r border-charcoal-700 whitespace-nowrap group hover:bg-charcoal-800 transition-colors cursor-pointer">
            <span className="text-[10px] text-gray-500 font-bold uppercase mr-2 group-hover:text-red-500 transition-colors">{match.title}</span>
            <span className="text-xs font-bold text-gray-300">
              {match.teamA} <span className="text-red-500">{match.scoreA}</span> : <span className="text-red-500">{match.scoreB}</span> {match.teamB}
            </span>
          </div>
        )) : (
          <div className="px-4 text-[11px] text-gray-500 italic flex items-center gap-2">
            <span className="w-2 h-2 bg-charcoal-700 rounded-full animate-pulse"></span>
            No live events tracking.
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchTicker;
