import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [matches, setMatches] = useState([]);
  const [posts, setPosts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const [matchesRes, postsRes] = await Promise.all([
        api.get('/matches'),
        api.get('/posts')
      ]);
      setMatches(matchesRes.data);
      setPosts(postsRes.data);
    };
    fetchData();
  }, []);

  const updateScore = async (id, scoreA, scoreB, status) => {
    try {
      await api.patch(`/admin/matches/${id}`, { scoreA, scoreB, status });
      setMatches(prev => prev.map(m => m.id === id ? { ...m, scoreA, scoreB, status } : m));
    } catch (err) {
      alert('Failed to update match');
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/admin/posts/${id}`);
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  const banUser = (username) => {
    alert(`IP Ban issued for ${username} (Mocked)`);
  };

  if (!user || (user.role !== 'ADMIN' && user.role !== 'REPORTER')) {
    return <div className="p-20 text-center font-bold uppercase text-red-500">Access Denied</div>;
  }

  return (
    <div className="p-4 flex flex-col gap-6">
      <header className="flex justify-between items-end border-b-2 border-red-600 pb-2">
        <h1 className="text-3xl font-black uppercase tracking-tighter italic text-red-600 leading-none">Slasher Dashboard</h1>
        <div className="text-[10px] font-bold text-gray-500 uppercase">Operator: {user.username}</div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-charcoal-800 border border-charcoal-700">
          <div className="bg-charcoal-700/50 px-3 py-1 text-[11px] font-bold text-gray-300 tracking-wider border-b border-charcoal-700 uppercase">Real-Time Event Control</div>
          <div className="flex flex-col max-h-[500px] overflow-y-auto">
            {matches.map(match => (
              <div key={match.id} className="flex flex-col p-3 border-b border-charcoal-700 gap-2 hover:bg-charcoal-700/10">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold uppercase tracking-tight">{match.teamA} vs {match.teamB}</span>
                  <span className={`text-[10px] px-1 font-bold ${match.status === 'LIVE' ? 'bg-red-600' : 'bg-charcoal-700'}`}>{match.status}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <input 
                      type="number" 
                      className="w-10 bg-charcoal-900 border border-charcoal-700 p-1 text-center text-xs font-bold" 
                      defaultValue={match.scoreA} 
                      id={`scoreA-${match.id}`}
                    />
                    <span className="text-gray-600">:</span>
                    <input 
                      type="number" 
                      className="w-10 bg-charcoal-900 border border-charcoal-700 p-1 text-center text-xs font-bold" 
                      defaultValue={match.scoreB}
                      id={`scoreB-${match.id}`}
                    />
                  </div>
                  <select 
                    className="flex-1 bg-charcoal-900 border border-charcoal-700 p-1 text-[10px] font-bold" 
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
                    className="bg-red-600 text-white px-3 py-1 text-[10px] font-bold uppercase hover:bg-red-700"
                  >
                    Set
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-charcoal-800 border border-charcoal-700">
          <div className="bg-charcoal-700/50 px-3 py-1 text-[11px] font-bold text-gray-300 tracking-wider border-b border-charcoal-700 uppercase">Recent Discussions & Moderation</div>
          <div className="flex flex-col max-h-[500px] overflow-y-auto">
            {posts.map(post => (
              <div key={post.id} className="flex items-center justify-between p-3 border-b border-charcoal-700 hover:bg-charcoal-700/10">
                <div className="flex flex-col min-w-0 pr-4">
                  <span className="text-xs font-bold truncate">{post.title}</span>
                  <span className="text-[10px] text-gray-500">by {post.author.username}</span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => banUser(post.author.username)}
                    className="border border-charcoal-600 text-gray-400 px-2 py-1 text-[10px] font-bold uppercase hover:bg-red-600 hover:text-white"
                  >
                    Ban IP
                  </button>
                  <button 
                    onClick={() => deletePost(post.id)}
                    className="bg-charcoal-700 text-gray-300 px-2 py-1 text-[10px] font-bold uppercase hover:bg-white hover:text-black"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
