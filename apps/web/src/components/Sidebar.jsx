import { useEffect, useState } from 'react';
import api from '../lib/api';

const Sidebar = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const { data } = await api.get('/matches');
      setMatches(data);
    };
    fetchMatches();
  }, []);

  const upcoming = matches.filter(m => m.status === 'UPCOMING').slice(0, 5);
  const completed = matches.filter(m => m.status === 'COMPLETED').slice(0, 5);

  const MatchModule = ({ title, items }) => (
    <div className="bg-charcoal-800 border border-charcoal-700 mb-6">
      <div className="bg-charcoal-700/50 px-3 py-1 text-[11px] font-bold text-gray-300 tracking-wider border-b border-charcoal-700 uppercase">{title}</div>
      <div className="flex flex-col">
        {items.length > 0 ? items.map(match => (
          <div key={match.id} className="flex items-center justify-between p-2 border-b border-charcoal-700 last:border-0 hover:bg-charcoal-700/20 transition-colors cursor-pointer">
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex justify-between items-center text-xs font-bold text-gray-200">
                <span className="truncate">{match.teamA}</span>
                <span className={match.status === 'COMPLETED' ? 'text-red-500' : 'text-gray-500'}>{match.scoreA}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-200">
                <span className="truncate">{match.teamB}</span>
                <span className={match.status === 'COMPLETED' ? 'text-red-500' : 'text-gray-500'}>{match.scoreB}</span>
              </div>
            </div>
            <div className="ml-4 pl-4 border-l border-charcoal-700 text-[10px] text-gray-500 whitespace-nowrap">
              {match.status === 'UPCOMING' ? new Date(match.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'FINAL'}
            </div>
          </div>
        )) : (
          <div className="p-3 text-[11px] text-gray-500 italic">No matches scheduled</div>
        )}
      </div>
    </div>
  );

  return (
    <aside className="w-full">
      <MatchModule title="Upcoming Matches" items={upcoming} />
      <MatchModule title="Recent Results" items={completed} />
      
      <div className="bg-charcoal-800 border border-charcoal-700 p-4">
        <h4 className="text-[11px] font-bold text-gray-400 uppercase mb-2">Featured Build</h4>
        <div className="aspect-video bg-charcoal-900 border border-charcoal-700 mb-2 overflow-hidden">
           <img src="https://via.placeholder.com/300x160" alt="Car" className="w-full h-full object-cover" />
        </div>
        <p className="text-xs font-bold text-gray-200">1998 Supra Twin Turbo Build</p>
        <p className="text-[10px] text-gray-500">By user_drift99</p>
      </div>
    </aside>
  );
};

export default Sidebar;
