import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { io } from 'socket.io-client';

const Comment = ({ comment, onReply }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  return (
    <div className="flex flex-col gap-2 mt-4 border-l-2 border-charcoal-700 pl-4">
      <div className="flex items-center gap-2 text-[11px]">
        <span className="font-bold text-red-500">{comment.author.username}</span>
        <span className="text-gray-500">•</span>
        <span className="text-gray-500">{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
      </div>
      <div className="text-sm text-gray-300">{comment.content}</div>
      <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500">
        <button className="hover:text-white" onClick={() => setShowReply(!showReply)}>REPLY</button>
        <button className="hover:text-white">UPVOTE</button>
      </div>

      {showReply && (
        <div className="mt-2">
          <textarea 
            className="w-full bg-charcoal-900 border border-charcoal-700 p-2 text-xs text-white focus:outline-none focus:border-red-600"
            rows="2"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <button 
            className="mt-1 bg-red-600 text-white px-3 py-1 text-[10px] font-bold uppercase"
            onClick={() => {
              onReply(comment.id, replyContent);
              setReplyContent('');
              setShowReply(false);
            }}
          >
            Submit
          </button>
        </div>
      )}

      {comment.replies && comment.replies.map(reply => (
        <Comment key={reply.id} comment={reply} onReply={onReply} />
      ))}
    </div>
  );
};

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const { user } = useAuth();
  const socketRef = useRef();

  const fetchPost = async () => {
    const { data } = await api.get(`/posts/${id}`);
    setPost(data);
  };

  useEffect(() => {
    fetchPost();

    socketRef.current = io('http://localhost:4000');
    socketRef.current.emit('join_post', id);

    socketRef.current.on('user_typing', ({ username }) => {
      setTypingUsers(prev => {
        if (prev.includes(username)) return prev;
        return [...prev, username];
      });
      setTimeout(() => {
        setTypingUsers(prev => prev.filter(u => u !== username));
      }, 3000);
    });

    socketRef.current.on('new_comment', () => {
      fetchPost();
    });

    return () => socketRef.current.disconnect();
  }, [id]);

  const handleTyping = () => {
    if (user) {
      socketRef.current.emit('typing', { postId: id, username: user.username });
    }
  };

  const handleComment = async (parentId = null, content) => {
    if (!user) return alert('Please login to comment');
    await api.post(`/posts/${id}/comments`, { content, parentId });
    fetchPost();
  };

  if (!post) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <article className="bg-charcoal-800 border border-charcoal-700 p-6">
        <div className="flex items-center gap-2 mb-2">
          {post.flair && (
            <span className="text-[10px] px-1 bg-red-600 text-white font-bold uppercase tracking-tighter">
              {post.flair}
            </span>
          )}
          <span className="text-[11px] text-gray-500 uppercase font-bold">Posted by {post.author.username} • {formatDistanceToNow(new Date(post.createdAt))} ago</span>
        </div>
        <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-300 whitespace-pre-wrap mb-8 text-sm leading-relaxed">
          {post.content}
        </div>

        <div className="border-t border-charcoal-700 pt-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">{post.comments?.length || 0} Comments</h2>
          
          {user && (
            <div className="mb-8">
              <textarea 
                className="w-full bg-charcoal-900 border border-charcoal-700 p-4 text-sm text-white focus:outline-none focus:border-red-600"
                rows="4"
                placeholder="What are your thoughts?"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                onKeyDown={handleTyping}
              />
              <div className="flex justify-between items-center mt-2">
                <button 
                  className="bg-red-600 text-white px-6 py-2 text-xs font-bold uppercase tracking-tighter"
                  onClick={() => {
                    handleComment(null, commentContent);
                    setCommentContent('');
                  }}
                >
                  Post Comment
                </button>
                {typingUsers.length > 0 && (
                  <div className="text-[10px] text-gray-500 italic font-bold">
                    {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col">
            {post.comments?.map(comment => (
              <Comment key={comment.id} comment={comment} onReply={handleComment} />
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};

export default PostPage;
