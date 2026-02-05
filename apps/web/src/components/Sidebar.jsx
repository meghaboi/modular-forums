import { useEffect, useState } from 'react';
import api from '../lib/api';
import { format } from 'date-fns';

const Sidebar = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const { data } = await api.get('/matches');
      setMatches(data);
    };
    fetchMatches();
  }, []);

  const completed = matches.filter(m => m.status === 'COMPLETED').slice(0, 5);
  const upcoming = matches.filter(m => m.status === 'UPCOMING').slice(0, 5);

  const MatchItem = ({ match }) => (
    <div className="flex justify-between items-center py-2 border-b border-charcoal-700 last:border-0 text-xs hover:bg-charcoal-700/50 transition-colors px-2 cursor-pointer">
      <div className="flex flex-col">
        <span className="font-bold text-gray-200">{match.teamA} vs {match.teamB}</span>
        <span className="text-[10px] text-gray-500">{format(new Date(match.startTime), 'MMM d, HH:mm')}</span>
      </div>
      {match.status === 'COMPLETED' ? (
        <span className="font-mono bg-charcoal-700 px-1 rounded text-white">{match.scoreA}-{match.scoreB}</span>
      ) : (
        <span className="text-[10px] text-gray-400">UPCOMING</span>
      )}
    </div>
  );

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col gap-4">
      <div className="bg-charcoal-800 border border-charcoal-700">
        <div className="bg-charcoal-700/50 px-3 py-1 text-[11px] font-bold text-gray-300 tracking-wider">COMPLETED MATCHES</div>
        <div>
          {completed.length > 0 ? completed.map(m => <MatchItem key={m.id} match={m} />) : <div className="p-3 text-xs text-gray-500 italic">None recently</div>}
        </div>
      </div>
      
      <div className="bg-charcoal-800 border border-charcoal-700">
        <div className="bg-charcoal-700/50 px-3 py-1 text-[11px] font-bold text-gray-300 tracking-wider">UPCOMING MATCHES</div>
        <div>
          {upcoming.length > 0 ? upcoming.map(m => <MatchItem key={m.id} match={m} />) : <div className="p-3 text-xs text-gray-500 italic">None scheduled</div>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
