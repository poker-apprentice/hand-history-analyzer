import BigNumber from 'bignumber.js';
import mapValues from 'lodash/mapValues';
import { State } from '~/types/State';

const calculateTotalRake = (state: State): BigNumber =>
  state.handStats.totalPot.minus(
    Object.values(state.playerStats).reduce(
      (acc, stats) => acc.plus(stats.totalAwarded),
      new BigNumber(0),
    ),
  );

const calculateTotalAwarded = (state: State) =>
  Object.values(state.playerStats).reduce(
    (acc, playerStats) => acc.plus(playerStats.totalAwarded),
    new BigNumber(0),
  );

export const calculateAggregates = (state: State): State => {
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
