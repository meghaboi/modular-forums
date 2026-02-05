import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-charcoal-800 border-b border-charcoal-700 h-12 flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-xl font-bold tracking-tighter text-white">VLR.GG CLONE</Link>
        <div className="hidden md:flex gap-4 text-sm font-medium text-gray-400">
          <Link to="/" className="hover:text-white transition-colors">FORUM</Link>
          <Link to="/matches" className="hover:text-white transition-colors">MATCHES</Link>
          <Link to="/news" className="hover:text-white transition-colors">NEWS</Link>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm">
        {user ? (
          <>
            {(user.role === 'ADMIN' || user.role === 'REPORTER') && (
              <Link to="/dashboard" className="text-red-500 font-bold hover:text-red-400 transition-colors uppercase tracking-widest text-[10px]">Dashboard</Link>
            )}
            <span className="text-gray-300">{user.username}</span>
            <button onClick={logout} className="text-gray-400 hover:text-white transition-colors">LOGOUT</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-400 hover:text-white transition-colors">LOGIN</Link>
            <Link to="/register" className="text-gray-400 hover:text-white transition-colors">REGISTER</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
