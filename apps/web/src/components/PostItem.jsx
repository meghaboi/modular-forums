import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const PostItem = ({ post }) => {
  return (
    <Link 
      to={`/post/${post.id}`}
      className="flex items-center gap-0 py-1.5 border-b border-charcoal-700 hover:bg-charcoal-700/40 transition-colors group px-2 text-xs"
    >
      <div className="w-10 shrink-0 text-center font-bold text-gray-500 group-hover:text-red-500 transition-colors">
        {post.netVotes || 0}
      </div>
      
      <div className="shrink-0 text-charcoal-700 px-1">|</div>

      <div className="flex-1 min-w-0 px-2 flex items-center gap-2">
        {post.flair && (
          <span className="text-[9px] px-1 bg-charcoal-700 text-gray-400 font-bold uppercase tracking-tighter border border-charcoal-600">
            {post.flair}
          </span>
        )}
        <h3 className="font-medium text-gray-300 group-hover:text-white truncate">
          {post.title}
        </h3>
      </div>

      <div className="shrink-0 text-charcoal-700 px-1">|</div>

      <div className="w-24 shrink-0 px-2 text-gray-500 truncate">
        {post.author.username}
      </div>

      <div className="shrink-0 text-charcoal-700 px-1">|</div>

      <div className="w-16 shrink-0 px-2 text-gray-500 text-[10px]">
        {formatDistanceToNow(new Date(post.createdAt)).replace('about ', '')}
      </div>

      <div className="shrink-0 text-charcoal-700 px-1">|</div>

      <div className="w-12 shrink-0 px-2 flex items-center justify-end gap-1 text-gray-500 font-bold">
        <span>{post._count.comments}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </div>
    </Link>
  );
};

export default PostItem;
