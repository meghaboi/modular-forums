import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const PostItem = ({ post }) => {
  return (
    <Link 
      to={`/post/${post.id}`}
      className="flex items-center gap-4 py-2 border-b border-charcoal-700 hover:bg-charcoal-700/30 transition-colors group px-2"
    >
      <div className="w-8 flex flex-col items-center justify-center font-bold text-gray-400 group-hover:text-white transition-colors">
        <span className="text-xs">{(post._count.votes || 0)}</span>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {post.flair && (
            <span className="text-[10px] px-1 bg-charcoal-700 text-gray-400 font-bold rounded uppercase tracking-tighter">{post.flair}</span>
          )}
          <h3 className="text-sm font-medium text-gray-200 group-hover:text-white truncate">{post.title}</h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
          <span className="text-gray-400">{post.author.username}</span>
          <span>•</span>
          <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
        </div>
      </div>

      <div className="flex items-center gap-1 text-gray-500 text-[11px]">
        <span>{post._count.comments}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </div>
    </Link>
  );
};

export default PostItem;
