import { useMemo } from 'react';
import { MERGED_ARCHIVE_DATA as MERGED_TRAFFIC_DATA, LAST_UPDATED_TIMESTAMP } from '../data/merged-gh-traffic-data';
import { MERGED_STARS_DATA, LAST_UPDATED_STARS_TIMESTAMP } from '../data/merged-gh-stars-data';

import Header from '../sections/Header';
import RepositoryMetricsGridSection from '../sections/RepositoryMetricsGridSection';
import ChartSelectionSection from '../sections/ChartSelectionSection';
import { HARDCODED_TRAFFIC_DATA, HARDCODED_STARS_DATA, PYPI_DATA } from '../data/hardcoded-data';
import Repository from '../types/repository';

/**
 * Agent Toolkit Analytics Dashboard
 * * Data Sources:
 * 1. GitHub Traffic: Manually transcribed from provided screenshots (Oct 30 - Dec 09).
 * 2. Stars: Based on uploaded CSV 'star-history-20251211.csv'.
 * 3. PyPI: Version-specific download data aggregated by date from provided CSV.
 */

function getDateFromTrafficData(trafficData: Array<{ date: string }>, isLast: boolean = false): Date {
  if (trafficData.length === 0) {
    return isLast ? new Date() : new Date('2024-10-30');
  }
  
  const targetEntry = isLast ? trafficData[trafficData.length - 1] : trafficData[0];
  const [month, day] = targetEntry.date.split('/').map(Number);
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();
  
  if (isLast) {
    let year = currentYear;
    if (month > currentMonth || (month === currentMonth && day > currentDay)) {
      year = currentYear - 1;
    }
    return new Date(year, month - 1, day);
  } else {
    return new Date(2024, month - 1, day);
  }
}

interface RepositoryStatsPageProps {
  repository: Repository
}

const RepositoryStatsPage = ({ repository }: RepositoryStatsPageProps) => {
  const trafficData = useMemo(() => {
    const gapBridgeEndDate = '01/01/2026';
    const hardcodedEndIndex = HARDCODED_TRAFFIC_DATA[repository.name].findIndex((d: any) => d.date === gapBridgeEndDate);
    const hardcodedUpToGap = HARDCODED_TRAFFIC_DATA[repository.name].slice(0, hardcodedEndIndex + 1);
    
    const archiveDataAfterGap = MERGED_TRAFFIC_DATA[repository.name].filter(d => {
      const [month, day, year] = d.date.split('/').map(Number);
      const [gapMonth, gapDay, gapYear] = gapBridgeEndDate.split('/').map(Number);

      const curDate = new Date(+year, +month-1, +day);
      const gapDate = new Date(+gapYear, +gapMonth-1, +gapDay);

      return curDate > gapDate;
    });

    return [...hardcodedUpToGap, ...archiveDataAfterGap];
  }, [repository]);

  const starsData = useMemo(() => {
    const hardcodedEndDate = '01/01/2026';
    const hardcodedEndIndex = HARDCODED_STARS_DATA[repository.name].findIndex((d: any) => d.date === hardcodedEndDate);
    const hardcodedUpToEnd = HARDCODED_STARS_DATA[repository.name].slice(0, hardcodedEndIndex + 1);
    
    const archiveDataAfterEnd = MERGED_STARS_DATA[repository.name].filter(d => {
      const [month, day, year] = d.date.split('/').map(Number);
      const [endMonth, endDay, endYear] = hardcodedEndDate.split('/').map(Number);

      const curDate = new Date(+year, +month-1, +day);
      const endDate = new Date(+endYear, +endMonth-1, +endDay);

      return curDate > endDate;
    });

    return [...hardcodedUpToEnd, ...archiveDataAfterEnd];
  }, [repository]);

  const pypiData = useMemo(() => {
    const hardcodedEndDate = "'01/01/2026";

    const hardcodedEndIndex = PYPI_DATA[repository.name].findIndex((d: any) => d.date === hardcodedEndDate);
    const hardcodedUpToEnd = PYPI_DATA[repository.name].slice(0, hardcodedEndIndex + 1);

    const pypiDataAfterEnd = PYPI_DATA[repository.name].filter(d => {
      const [month, day, year] = d.date.split('/').map(Number);
      const [endMonth, endDay, endYear] = hardcodedEndDate.split('/').map(Number);

      const curDate = new Date(+year, +month-1, +day);
      const endDate = new Date(+endYear, +endMonth-1, +endDay);

      return curDate > endDate;
    });

    return [...hardcodedUpToEnd, ...pypiDataAfterEnd];
  }, [repository]);

  const currentDate = useMemo(() => getDateFromTrafficData(trafficData, true), [trafficData]);
  const dataStartDate = useMemo(() => getDateFromTrafficData(trafficData, false), [trafficData]);
  
  const lastUpdated = useMemo(() => {
    const trafficTimestamp = LAST_UPDATED_TIMESTAMP || null;
    const starsTimestamp = LAST_UPDATED_STARS_TIMESTAMP || null;
    
    if (trafficTimestamp && starsTimestamp) {
      return new Date(trafficTimestamp) > new Date(starsTimestamp) 
        ? new Date(trafficTimestamp) 
        : new Date(starsTimestamp);
    }
    if (trafficTimestamp) return new Date(trafficTimestamp);
    if (starsTimestamp) return new Date(starsTimestamp);
    return currentDate;
  }, [currentDate]);

  // Calculate days since data collection started
  const daysSinceDataStart = useMemo(() => {
    const diffTime = currentDate.getTime() - dataStartDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [currentDate, dataStartDate]);

  // Calculate totals for cards
  const totalClones = useMemo(() => trafficData.reduce((acc, curr) => acc + curr.clones, 0), [trafficData]);
  const totalUniqueCloners = useMemo(() => trafficData.reduce((acc, curr) => acc + curr.uniqueCloners, 0), [trafficData]);
  const totalViews = useMemo(() => trafficData.reduce((acc, curr) => acc + curr.views, 0), [trafficData]);
  const totalUniqueVisitors = useMemo(() => trafficData.reduce((acc, curr) => acc + curr.uniqueVisitors, 0), [trafficData]);

  // Calculate last 7 days metrics
  const last7Days = useMemo(() => trafficData.slice(-7), [repository]);
  const last7DaysClones = useMemo(() => last7Days.reduce((acc, curr) => acc + curr.clones, 0), [last7Days]);
  const last7DaysUniqueCloners = useMemo(() => last7Days.reduce((acc, curr) => acc + curr.uniqueCloners, 0), [last7Days]);
  const last7DaysViews = useMemo(() => last7Days.reduce((acc, curr) => acc + curr.views, 0), [last7Days]);
  const last7DaysUniqueVisitors = useMemo(() => last7Days.reduce((acc, curr) => acc + curr.uniqueVisitors, 0), [last7Days]);
  const last7DaysStars = useMemo(() => {
    if (starsData.length === 0) return 0;
    const currentStars = starsData[starsData.length - 1]?.stars || 0;
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoMonth = String(sevenDaysAgo.getMonth() + 1).padStart(2, '0');
    const sevenDaysAgoDay = String(sevenDaysAgo.getDate()).padStart(2, '0');
    const sevenDaysAgoDate = `${sevenDaysAgoMonth}/${sevenDaysAgoDay}`;
    
    const sevenDaysAgoEntry = starsData.find(d => d.date === sevenDaysAgoDate);
    if (!sevenDaysAgoEntry && starsData.length > 0) {
      const sortedData = [...starsData].sort((a, b) => {
        const [aMonth, aDay] = a.date.split('/').map(Number);
        const [bMonth, bDay] = b.date.split('/').map(Number);
        const [targetMonth, targetDay] = sevenDaysAgoDate.split('/').map(Number);
        const aDiff = Math.abs((aMonth * 100 + aDay) - (targetMonth * 100 + targetDay));
        const bDiff = Math.abs((bMonth * 100 + bDay) - (targetMonth * 100 + targetDay));
        return aDiff - bDiff;
      });
      const sevenDaysAgoStars = sortedData[0]?.stars || currentStars;
      return Math.max(0, currentStars - sevenDaysAgoStars);
    }
    const sevenDaysAgoStars = sevenDaysAgoEntry?.stars || currentStars;
    return Math.max(0, currentStars - sevenDaysAgoStars);
  }, [starsData, currentDate]);
  const last7DaysPyPI = useMemo(() => {
    const sortedPyPI = [...pypiData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const result = sortedPyPI[0]?.downloads || 0;
    return result;
  }, [repository]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Header lastUpdated={lastUpdated}/>

      <RepositoryMetricsGridSection
        last7DaysClones={last7DaysClones}
        last7DaysStars={last7DaysStars}
        last7DaysPyPI={last7DaysPyPI}
        last7DaysUniqueCloners={last7DaysUniqueCloners}
        last7DaysUniqueVisitors={last7DaysUniqueVisitors}
        last7DaysViews={last7DaysViews}
        totalClones={totalClones}
        totalUniqueCloners={totalUniqueCloners}
        totalUniqueVisitors={totalUniqueVisitors}
        totalViews={totalViews}
        starsData={starsData}
      /> 

      <ChartSelectionSection 
        repository={repository}
        starsData={starsData}
        trafficData={trafficData}
        pypiData={pypiData}
        daysSinceDataStart={daysSinceDataStart}
      />
    </main>
  );
}

export default RepositoryStatsPage;