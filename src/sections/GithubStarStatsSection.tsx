import { Star } from 'lucide-react';

import StatCard from '../components/StatCard';

const GithubStarStatsSection = ({ stats }) => (
  <div>
    <h3 className="text-sm font-medium text-[#8b949e] mb-3 flex items-center gap-2">
      <Star className="w-4 h-4" />
      GitHub Stars
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatCard 
      title="Total Stars" 
      value={stats.STARS_DATA.length > 0 ? stats.STARS_DATA[stats.STARS_DATA.length - 1]?.stars?.toLocaleString() || "237" : "237"} 
      subtext={`+${stats.last7DaysStars} last 7 days`}
      trend="up"
      icon={Star} 
      />
    </div>
  </div>
);

export default GithubStarStatsSection;