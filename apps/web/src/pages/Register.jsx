import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Email or username might be taken.');
    }
  };

  return (
    <div className="flex justify-center pt-20">
      <div className="w-full max-w-sm bg-charcoal-800 border border-charcoal-700 p-6 shadow-2xl">
        <h2 className="text-xl font-bold mb-6 text-center tracking-tighter uppercase">Register</h2>
        {error && <div className="bg-red-900/50 border border-red-500 text-red-200 p-2 text-xs mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Username</label>
            <input 
              type="text" 
              className="bg-charcoal-900 border border-charcoal-700 p-2 text-sm focus:outline-none focus:border-red-500 transition-colors" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
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
          <button type="submit" className="bg-white text-black font-bold py-2 text-sm mt-2 hover:bg-gray-200 transition-colors uppercase tracking-widest">Register</button>
        </form>
        <p className="text-[10px] text-gray-500 mt-6 text-center uppercase tracking-widest font-bold">
          Already have an account? <Link to="/login" className="text-white hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
