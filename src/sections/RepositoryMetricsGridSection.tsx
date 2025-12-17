import GithubStarStatsSection from "./GithubStarStatsSection";
import RepositoryCloneStatsSection from "./RepositoryCloneStatsSection";
import RepositoryViewStatsSection from "./RepositoryViewStatsSection";
import PypiStatsSection from "./PypiStatsSection";

interface RepositoryMetricsGridSectionProps {
  starsData: any;
  last7DaysStars: number;
  totalClones: number;
  last7DaysClones: number;
  totalUniqueCloners: number;
  last7DaysUniqueCloners: number;
  totalViews: number;
  last7DaysViews: number;
  totalUniqueVisitors: number;
  last7DaysUniqueVisitors: number;
  last7DaysPyPI: number;
}
const RepositoryMetricsGridSection = ({ 
  last7DaysClones, 
  last7DaysStars, 
  last7DaysPyPI,
  last7DaysUniqueCloners, 
  last7DaysUniqueVisitors,
  last7DaysViews,
  totalClones, 
  totalUniqueCloners, 
  totalUniqueVisitors,
  totalViews, 
  starsData, 
}: RepositoryMetricsGridSectionProps) => (
  <div className="space-y-6 mb-8">
    <GithubStarStatsSection
      starsData={starsData}
      last7DaysStars={last7DaysStars}
    />

    <RepositoryCloneStatsSection
      totalClones={totalClones}
      last7DaysClones={last7DaysClones}
      totalUniqueCloners={totalUniqueCloners}
      last7DaysUniqueCloners={last7DaysUniqueCloners}
    />

    <RepositoryViewStatsSection 
      totalViews={totalViews}
      last7DaysViews={last7DaysViews}
      totalUniqueVisitors={totalUniqueVisitors}
      last7DaysUniqueVisitors={last7DaysUniqueVisitors}
    />

    <PypiStatsSection 
      last7DaysPyPI={last7DaysPyPI}
    />
  </div>
);

export default RepositoryMetricsGridSection;