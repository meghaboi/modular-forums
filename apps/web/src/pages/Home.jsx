import Sidebar from '../components/Sidebar';
import PostList from '../components/PostList';

const Home = () => {
  // Fake news data
  const news = [
    { id: 1, title: "Indian Startup Ecosystem Reaches New Heights", thumbnail: "https://via.placeholder.com/400x200", author: "Staff", date: "2h ago" },
    { id: 2, title: "Automotive Industry Shifts to High Gear in Q1", thumbnail: "https://via.placeholder.com/400x200", author: "Reporter", date: "5h ago" }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4">
      {/* Left Column: News */}
      <div className="flex-1 flex flex-col gap-6">
        <section className="bg-charcoal-800 border border-charcoal-700">
          <div className="bg-charcoal-700/50 px-3 py-1 text-[11px] font-bold text-gray-300 tracking-wider border-b border-charcoal-700 uppercase text-red-500">Curated News</div>
          <div className="flex flex-col">
            {news.map(item => (
              <div key={item.id} className="group cursor-pointer border-b border-charcoal-700 last:border-0 pb-0">
                <div className="aspect-video w-full overflow-hidden bg-charcoal-900">
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold leading-tight group-hover:text-red-500 transition-colors">{item.title}</h2>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 font-medium uppercase tracking-tight">
                    <span className="text-gray-400">{item.author}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Right Column: Forum feed */}
      <div className="w-full lg:w-[400px] flex flex-col gap-6">
        <PostList />
        <Sidebar />
      </div>
    </div>
  );
};

export default Home;
