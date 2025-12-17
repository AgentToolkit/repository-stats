import GithubStarStatsSection from "./GithubStarStatsSection";
import RepositoryCloneStatsSection from "./RepositoryCloneStatsSection";
import RepositoryViewStatsSection from "./RepositoryViewStatsSection";
import PypiStatsSection from "./PypiStatsSection";

const RepositoryMetricsGridSection = ({ stats }) => (
  <div className="space-y-6 mb-8">
    <GithubStarStatsSection stats={{
      STARS_DATA: stats.STARS_DATA,
      last7DaysStars: stats.last7DaysStars
    }}
    />

    <RepositoryCloneStatsSection stats={{
      totalClones: stats.totalClones,
      last7DaysClones: stats.last7DaysClones,
      totalUniqueCloners: stats.totalUniqueCloners,
      last7DaysUniqueCloners: stats.last7DaysUniqueCloners
    }}
    />

    <RepositoryViewStatsSection stats={{
      totalViews: stats.totalViews,
      last7DaysViews: stats.last7DaysViews,
      totalUniqueVisitors: stats.totalUniqueVisitors,
      last7DaysUniqueVisitors: stats.last7DaysUniqueVisitors
    }}
    />

    <PypiStatsSection stats={{
      last7DaysPyPI: stats.last7DaysPyPI
    }}
    />
  </div>
);

export default RepositoryMetricsGridSection;