import { AnalyzeStats, AnalyzeStatsOptions } from './AnalyzeStats';

export type GetStatsOptions = AnalyzeStatsOptions;

export const getStats = (options: GetStatsOptions) => new AnalyzeStats(options).analyze();
