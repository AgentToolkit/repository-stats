import { GitPullRequest, Users } from 'lucide-react';

import StatCard from '../components/StatCard';

const RepositoryCloneStatsSection = ({ stats }) => (
    <div>
      <h3 className="text-sm font-medium text-[#8b949e] mb-3 flex items-center gap-2">
        <GitPullRequest className="w-4 h-4" />
        Repository Clones
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard 
        title="Total Clones" 
        value={stats.totalClones.toLocaleString()} 
        subtext={`+${stats.last7DaysClones} last 7 days`}
        trend="up"
        icon={GitPullRequest} 
        />
        <StatCard 
        title="Unique Cloners" 
        value={stats.totalUniqueCloners} 
        subtext={`+${stats.last7DaysUniqueCloners} last 7 days`}
        trend="up"
        icon={Users} 
        />
      </div>
    </div>
);

export default RepositoryCloneStatsSection;