import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('FORUM');
  const [flair, setFlair] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/posts', { title, content, type, flair });
      navigate(`/post/${data.id}`);
    } catch (err) {
      alert('Failed to create post');
    }
  };

  if (!user) return <div className="p-20 text-center uppercase font-bold text-red-500">Login to post</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="bg-charcoal-800 border border-charcoal-700">
        <div className="bg-charcoal-700/50 px-3 py-1 text-[11px] font-bold text-gray-300 tracking-wider border-b border-charcoal-700 uppercase">New Discussion / Build Log</div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Title</label>
            <input 
              className="w-full bg-charcoal-900 border border-charcoal-700 p-2 text-sm text-white focus:outline-none focus:border-red-600"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Type</label>
              <select 
                className="w-full bg-charcoal-900 border border-charcoal-700 p-2 text-sm text-white focus:outline-none"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="FORUM">Forum Thread</option>
                <option value="BUILD_LOG">Build Log</option>
                {user.role !== 'USER' && <option value="NEWS">News Article</option>}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Flair</label>
              <input 
                className="w-full bg-charcoal-900 border border-charcoal-700 p-2 text-sm text-white focus:outline-none"
                placeholder="e.g. SaaS, Fintech, 2JZ"
                value={flair}
                onChange={(e) => setFlair(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Content</label>
            <textarea 
              className="w-full bg-charcoal-900 border border-charcoal-700 p-4 text-sm text-white focus:outline-none focus:border-red-600"
              rows="10"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit"
            className="bg-red-600 text-white font-bold uppercase py-2 px-6 text-sm hover:bg-red-700 transition-colors self-start"
          >
            Submit Thread
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
