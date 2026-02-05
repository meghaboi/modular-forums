import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const PostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState('');

  const fetchPost = async () => {
    const { data } = await api.get(`/posts/${id}`);
    setPost(data);
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleComment = async (parentId = null, text = commentText) => {
    if (!text.trim()) return;
    await api.post(`/posts/${id}/comments`, { content: text, parentId });
    setCommentText('');
    fetchPost();
  };

  if (!post) return <div className="p-8 text-center text-gray-500 uppercase tracking-widest font-bold">Loading Thread...</div>;

  const Comment = ({ comment, depth = 0 }) => (
    <div className={`flex flex-col gap-2 py-4 border-l border-charcoal-700 ${depth > 0 ? 'ml-4 pl-4' : ''}`}>
      <div className="flex items-center gap-2 text-xs">
        <span className="font-bold text-red-500">{comment.author.username}</span>
        <span className="text-gray-500 tracking-tighter">{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
      </div>
      <p className="text-sm text-gray-200">{comment.content}</p>
      <div className="flex gap-4">
        <button 
          onClick={() => {
            const reply = prompt('Enter your reply:');
            if (reply) handleComment(comment.id, reply);
          }}
          className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-tighter"
        >
          Reply
        </button>
      </div>
      {comment.replies && comment.replies.map(reply => (
        <Comment key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">
      <article className="bg-charcoal-800 border border-charcoal-700 p-6">
        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">
          {post.flair && <span className="bg-charcoal-700 px-1 text-gray-400">{post.flair}</span>}
          <span>Posted by {post.author.username} • {formatDistanceToNow(new Date(post.createdAt))} ago</span>
        </div>
        <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">{post.content}</div>
      </article>

      <section className="bg-charcoal-800 border border-charcoal-700">
        <div className="bg-charcoal-700/50 px-3 py-1 text-[11px] font-bold text-gray-300 tracking-wider border-b border-charcoal-700 uppercase">Discussion</div>
        <div className="p-4">
          {user ? (
            <div className="flex flex-col gap-2 mb-8">
              <textarea 
                className="bg-charcoal-900 border border-charcoal-700 p-3 text-sm focus:outline-none focus:border-red-500 w-full min-h-[100px]" 
                placeholder="What are your thoughts?"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button 
                onClick={() => handleComment()}
                className="bg-white text-black font-bold py-1.5 px-4 text-xs self-end hover:bg-gray-200 transition-colors uppercase tracking-widest"
              >
                Post Comment
              </button>
            </div>
          ) : (
            <div className="bg-charcoal-900 border border-charcoal-700 p-4 text-center text-xs text-gray-500 mb-8 uppercase tracking-widest font-bold">
              Please <Link to="/login" className="text-white hover:underline">login</Link> to participate in the discussion.
            </div>
          )}

          <div className="flex flex-col gap-2">
            {post.comments && post.comments.map(comment => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PostPage;
