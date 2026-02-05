import { useEffect, useState } from 'react';
import api from '../lib/api';
import { io } from 'socket.io-client';

const MatchTicker = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const { data } = await api.get('/matches');
      setMatches(data);
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
      <div className="bg-red-600 text-white text-[10px] font-bold px-2 h-full flex items-center shrink-0">LIVE</div>
      <div className="flex gap-4 px-4 overflow-x-auto no-scrollbar items-center">
        {liveMatches.length > 0 ? liveMatches.map(match => (
          <div key={match.id} className="flex items-center gap-2 whitespace-nowrap text-xs border-r border-charcoal-700 pr-4">
            <span className="text-gray-400">{match.title}</span>
            <span className="font-bold">{match.teamA} {match.scoreA} : {match.scoreB} {match.teamB}</span>
          </div>
        )) : (
          <span className="text-xs text-gray-500 italic">No live events at the moment</span>
        )}
      </div>
    </div>
  );
};

export default MatchTicker;
