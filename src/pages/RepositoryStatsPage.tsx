import { useMemo } from 'react';
import { MERGED_ARCHIVE_DATA, LAST_UPDATED_TIMESTAMP } from '../data/merged-archive-data';
import { MERGED_STARS_DATA, LAST_UPDATED_STARS_TIMESTAMP } from '../data/merged-stars-data';

import Header from '../sections/Header';
import RepositoryMetricsGridSection from '../sections/RepositoryMetricsGridSection';
import ChartSelectionSection from '../sections/ChartSelectionSection';
import { HARDCODED_TRAFFIC_DATA, HARDCODED_STARS_DATA, PYPI_DATA } from '../data/hardcoded-data';
import Repository from '../types/repository';

/**
 * Agent Toolkit Analytics Dashboard
 * * Data Sources:
 * 1. GitHub Traffic: Manually transcribed from provided screenshots (Oct 30 - Dec 09).
 * 2. Stars: Based on uploaded CSV 'star-history-20251211.csv' + current count (237).
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
  const TRAFFIC_DATA = useMemo(() => {
    const gapBridgeEndDate = '11/26';
    const hardcodedEndIndex = HARDCODED_TRAFFIC_DATA[repository.name].findIndex(d => d.date === gapBridgeEndDate);
    const hardcodedUpToGap = HARDCODED_TRAFFIC_DATA[repository.name].slice(0, hardcodedEndIndex + 1);
    
    const archiveDataAfterGap = MERGED_ARCHIVE_DATA.filter(d => {
      const [month, day] = d.date.split('/').map(Number);
      const [gapMonth, gapDay] = gapBridgeEndDate.split('/').map(Number);
      return month > gapMonth || (month === gapMonth && day > gapDay);
    });

    return [...hardcodedUpToGap, ...archiveDataAfterGap];
  }, []);

  const STARS_DATA = useMemo(() => {
    const hardcodedEndDate = '12/11';
    const hardcodedEndIndex = HARDCODED_STARS_DATA[repository.name].findIndex(d => d.date === hardcodedEndDate);
    const hardcodedUpToEnd = HARDCODED_STARS_DATA[repository.name].slice(0, hardcodedEndIndex + 1);
    
    const archiveDataAfterEnd = MERGED_STARS_DATA.filter(d => {
      const [month, day] = d.date.split('/').map(Number);
      const [endMonth, endDay] = hardcodedEndDate.split('/').map(Number);
      return month > endMonth || (month === endMonth && day > endDay);
    });

    return [...hardcodedUpToEnd, ...archiveDataAfterEnd];
  }, []);

  const CURRENT_DATE = useMemo(() => getDateFromTrafficData(TRAFFIC_DATA, true), [TRAFFIC_DATA]);
  const DATA_START_DATE = useMemo(() => getDateFromTrafficData(TRAFFIC_DATA, false), [TRAFFIC_DATA]);
  
  const LAST_UPDATED = useMemo(() => {
    const trafficTimestamp = LAST_UPDATED_TIMESTAMP || null;
    const starsTimestamp = LAST_UPDATED_STARS_TIMESTAMP || null;
    
    if (trafficTimestamp && starsTimestamp) {
      return new Date(trafficTimestamp) > new Date(starsTimestamp) 
        ? new Date(trafficTimestamp) 
        : new Date(starsTimestamp);
    }
    if (trafficTimestamp) return new Date(trafficTimestamp);
    if (starsTimestamp) return new Date(starsTimestamp);
    return CURRENT_DATE;
  }, [CURRENT_DATE]);

  // Calculate days since data collection started
  const daysSinceDataStart = useMemo(() => {
    const diffTime = CURRENT_DATE.getTime() - DATA_START_DATE.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [CURRENT_DATE, DATA_START_DATE]);

  // Calculate totals for cards
  const totalClones = useMemo(() => TRAFFIC_DATA.reduce((acc, curr) => acc + curr.clones, 0), [TRAFFIC_DATA]);
  const totalUniqueCloners = useMemo(() => TRAFFIC_DATA.reduce((acc, curr) => acc + curr.uniqueCloners, 0), [TRAFFIC_DATA]);
  const totalViews = useMemo(() => TRAFFIC_DATA.reduce((acc, curr) => acc + curr.views, 0), [TRAFFIC_DATA]);
  const totalUniqueVisitors = useMemo(() => TRAFFIC_DATA.reduce((acc, curr) => acc + curr.uniqueVisitors, 0), [TRAFFIC_DATA]);

  // Calculate last 7 days metrics
  const last7Days = useMemo(() => TRAFFIC_DATA.slice(-7), []);
  const last7DaysClones = useMemo(() => last7Days.reduce((acc, curr) => acc + curr.clones, 0), [last7Days]);
  const last7DaysStars = useMemo(() => {
    if (STARS_DATA.length === 0) return 0;
    const currentStars = STARS_DATA[STARS_DATA.length - 1]?.stars || 237;
    const sevenDaysAgo = new Date(CURRENT_DATE);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoMonth = String(sevenDaysAgo.getMonth() + 1).padStart(2, '0');
    const sevenDaysAgoDay = String(sevenDaysAgo.getDate()).padStart(2, '0');
    const sevenDaysAgoDate = `${sevenDaysAgoMonth}/${sevenDaysAgoDay}`;
    
    const sevenDaysAgoEntry = STARS_DATA.find(d => d.date === sevenDaysAgoDate);
    if (!sevenDaysAgoEntry && STARS_DATA.length > 0) {
      const sortedData = [...STARS_DATA].sort((a, b) => {
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
  }, [STARS_DATA, CURRENT_DATE]);
  const last7DaysPyPI = useMemo(() => {
    const sortedPyPI = [...PYPI_DATA[repository.name]].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sortedPyPI[0]?.downloads || 0;
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Header stats={{LAST_UPDATED: LAST_UPDATED}}/>

      <RepositoryMetricsGridSection stats={{
        last7Days: last7Days,
        last7DaysClones: last7DaysClones,
        last7DaysStars: last7DaysStars,
        last7DaysPyPI: last7DaysPyPI,
        totalClones: totalClones,
        totalUniqueCloners: totalUniqueCloners,
        totalUniqueVisitors: totalUniqueVisitors,
        totalViews: totalViews,
        STARS_DATA: STARS_DATA
      }} 
      /> 

      <ChartSelectionSection repository={repository} stats={{
        STARS_DATA: STARS_DATA,
        TRAFFIC_DATA: TRAFFIC_DATA,
        PYPI_DATA: PYPI_DATA[repository.name],
        daysSinceDataStart: daysSinceDataStart,
      }}
      />
    </main>
  );
}

export default RepositoryStatsPage;