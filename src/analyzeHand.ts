import { HandHistory } from '@poker-apprentice/hand-history-parser';
import mapValues from 'lodash/mapValues';
import pick from 'lodash/pick';
import { InvalidDataError } from './errors/InvalidDataError';
import { HandHistoryStats, HandStats, PlayerStats } from './types';
import { applyAction, getInitialState } from './utils/applyAction';
import { calculateAggregates } from './utils/calculateAggregates';

export const analyzeHand = ({ actions, info, players }: HandHistory): HandHistoryStats => {
  const heroes = players.filter((player) => player.isHero);
  if (heroes.length !== 1) {
    throw new InvalidDataError('Hand histories should only involve one hero.');
  }

  // TODO: include a boolean that provides this in `@poker-apprentice/hand-history-parser`
  const isAnonymous = info.site === 'bovada';

  // generate a default set of values for hand & player stats
  let state = getInitialState(players);

  // update hand & player stats based upon each action that took place during the hand
  actions.forEach((action) => {
    state = applyAction({ state, action });
  });

  // calculate aggregate data
  state = calculateAggregates(state);

  // convert BigNumber values to strings
  const handStats: HandStats = {
    ...state.handStats,
    totalPot: state.handStats.totalPot.toString(),
    totalRake: state.handStats.totalRake.toString(),
  };
  const playerStats: Record<string, PlayerStats> = mapValues(state.playerStats, (playerStat) => ({
    ...playerStat,
    totalAwarded: playerStat.totalAwarded.toString(),
    totalContributed: playerStat.totalContributed.toString(),
    totalRakeContributed: playerStat.totalRakeContributed.toString(),
    totalWon: playerStat.totalWon.toString(),
  }));

  return {
    hand: handStats,
    players: isAnonymous ? pick(playerStats, heroes[0].name) : playerStats,
  };
};
