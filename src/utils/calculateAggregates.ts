import BigNumber from 'bignumber.js';
import mapValues from 'lodash/mapValues';
import { CalculatedState } from './applyAction';

const calculateTotalRake = (state: CalculatedState): BigNumber =>
  state.handStats.totalPot.minus(
    Object.values(state.playerStats).reduce(
      (acc, stats) => acc.plus(stats.totalAwarded),
      new BigNumber(0),
    ),
  );

const calculateTotalAwarded = (state: CalculatedState) =>
  Object.values(state.playerStats).reduce(
    (acc, playerStats) => acc.plus(playerStats.totalAwarded),
    new BigNumber(0),
  );

export const calculateAggregates = (state: CalculatedState): CalculatedState => {
  const totalRake = calculateTotalRake(state);
  const totalAwardedToEveryone = calculateTotalAwarded(state);

  return {
    ...state,
    handStats: { ...state.handStats, totalRake },
    playerStats: mapValues(state.playerStats, (playerStats) => ({
      ...playerStats,
      totalRakeContributed: totalRake.times(playerStats.totalAwarded.div(totalAwardedToEveryone)),
    })),
  };
};
