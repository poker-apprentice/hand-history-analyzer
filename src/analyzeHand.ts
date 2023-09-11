import { HandHistory } from '@poker-apprentice/hand-history-parser';
import mapValues from 'lodash/mapValues';
import pickBy from 'lodash/pickBy';
import { InvalidDataError } from './errors/InvalidDataError';
import { HandHistoryStats, HandStats, PlayerStats } from './types';
import { applyAction, getInitialState } from './utils/applyAction';
import { calculateAggregates } from './utils/calculateAggregates';

/**
 * Parses a `HandHistory` object returned by `@poker-apprentice/hand-history-parser`.
 *
 * @throws {@link InvalidDataError} if number of `players` flagged as `isHero` !== 1
 */
export const analyzeHand = ({ actions, players }: HandHistory): HandHistoryStats => {
  const heroes = players.filter((player) => player.isHero);
  if (heroes.length !== 1) {
    throw new InvalidDataError('Hand histories should only involve one hero.');
  }

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

  const knownPlayers = new Set(
    players.filter((player) => !player.isAnonymous).map((player) => player.name),
  );

  return {
    hand: handStats,
    players: pickBy(playerStats, (_stats, name) => knownPlayers.has(name)),
  };
};
