import { useEffect, useState } from 'react';
import api from '../lib/api';
import PostItem from './PostItem';

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await api.get('/posts');
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <div className="bg-charcoal-800 border border-charcoal-700">
      <div className="bg-charcoal-700/50 px-3 py-1 text-[11px] font-bold text-gray-300 tracking-wider border-b border-charcoal-700">RECENT DISCUSSIONS</div>
      <div className="flex flex-col">
        {posts.length > 0 ? posts.map(post => (
          <PostItem key={post.id} post={post} />
        )) : (
          <div className="p-4 text-sm text-gray-500 italic">No discussions found.</div>
        )}
      </div>
    </div>
  );
};

export default PostList;
