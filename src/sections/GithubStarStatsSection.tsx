import { Star } from 'lucide-react';

import StatCard from '../components/StatCard';

interface GithubStarStatsSectionProps {
  starsData: any[];
  last7DaysStars: number;
}
const GithubStarStatsSection = ({ starsData, last7DaysStars }: GithubStarStatsSectionProps) => (
  <div>
    <h3 className="text-sm font-medium text-[#8b949e] mb-3 flex items-center gap-2">
      <Star className="w-4 h-4" />
      GitHub Stars
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatCard 
      title="Total Stars" 
      value={starsData.length > 0 ? starsData[starsData.length - 1]?.stars?.toLocaleString() || "0" : "0"} 
      subtext={`+${last7DaysStars.toLocaleString()} last 7 days`}
      trend="up"
      icon={Star} 
      />
    </div>
  </div>
);

export default GithubStarStatsSection;