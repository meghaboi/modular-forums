import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex justify-center pt-20">
      <div className="w-full max-w-sm bg-charcoal-800 border border-charcoal-700 p-6 shadow-2xl">
        <h2 className="text-xl font-bold mb-6 text-center tracking-tighter uppercase">Login</h2>
        {error && <div className="bg-red-900/50 border border-red-500 text-red-200 p-2 text-xs mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email</label>
            <input 
              type="email" 
              className="bg-charcoal-900 border border-charcoal-700 p-2 text-sm focus:outline-none focus:border-red-500 transition-colors" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
            <input 
              type="password" 
              className="bg-charcoal-900 border border-charcoal-700 p-2 text-sm focus:outline-none focus:border-red-500 transition-colors" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="bg-white text-black font-bold py-2 text-sm mt-2 hover:bg-gray-200 transition-colors uppercase tracking-widest">Login</button>
        </form>
        <p className="text-[10px] text-gray-500 mt-6 text-center uppercase tracking-widest font-bold">
          No account? <Link to="/register" className="text-white hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
