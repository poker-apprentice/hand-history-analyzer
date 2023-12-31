import type { Street } from '@poker-apprentice/hand-history-parser';
import BigNumber from 'bignumber.js';
import { HandStats, PlayerStats } from '~/types';
import { OmitStrict } from './OmitStrict';

export interface HandStatsState extends Omit<HandStats, 'totalPot' | 'totalRake'> {
  totalPot: BigNumber;
  totalRake: BigNumber;
}

export interface PlayerStatsState
  extends OmitStrict<
    PlayerStats,
    | 'totalAwarded'
    | 'totalContributed'
    | 'totalRakeContributed'
    | 'totalWon'
    | 'tournamentPlacementPrize'
    | 'bountiesWon'
  > {
  totalAwarded: BigNumber;
  totalContributed: BigNumber;
  totalRakeContributed: BigNumber;
  totalWon: BigNumber;
  tournamentPlacementPrize: BigNumber;
  bountiesWon: BigNumber;
}

export type AllPlayerStatsState = Record<string, PlayerStatsState>;

export interface State {
  currentStreet: Street;
  currentStreetRaiseCount: number;
  handStats: HandStatsState;
  playerStats: AllPlayerStatsState;
}
