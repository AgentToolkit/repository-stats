import { GitPullRequest, Users } from 'lucide-react';

import StatCard from '../components/StatCard';

interface RepositoryCloneStatsSectionProps {
  totalClones: number;
  last7DaysClones: number;
  totalUniqueCloners: number;
  last7DaysUniqueCloners: number;
}

const RepositoryCloneStatsSection = ({ totalClones, last7DaysClones, totalUniqueCloners, last7DaysUniqueCloners }: RepositoryCloneStatsSectionProps) => (
    <div>
      <h3 className="text-sm font-medium text-[#8b949e] mb-3 flex items-center gap-2">
        <GitPullRequest className="w-4 h-4" />
        Repository Clones
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard 
        title="Total Clones" 
        value={totalClones.toLocaleString()} 
        subtext={`+${last7DaysClones.toLocaleString()} last 7 days`}
        trend="up"
        icon={GitPullRequest} 
        />
        <StatCard 
        title="Unique Cloners" 
        value={totalUniqueCloners.toLocaleString()} 
        subtext={`+${last7DaysUniqueCloners.toLocaleString()} last 7 days`}
        trend="up"
        icon={Users} 
        />
      </div>
    </div>
);

export default RepositoryCloneStatsSection;