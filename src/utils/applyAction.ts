import {
  Action,
  AwardPotAction,
  BetAction,
  CallAction,
  CheckAction,
  DealBoardAction,
  FoldAction,
  Player,
  PostAction,
  RaiseAction,
  ReturnBetAction,
  ShowdownAction,
} from '@poker-apprentice/hand-history-parser';
import assertNever from 'assert-never';
import BigNumber from 'bignumber.js';
import merge from 'lodash/merge';
import { StreetStat } from '~/types';
import { AllPlayerStatsState, PlayerStatsState, State } from '~/types/State';

export const getInitialState = (players: Player[] = []): State => ({
  currentStreet: 'preflop',
  currentStreetRaiseCount: 1, // start at 1 preflop since the blinds count as the first bet
  handStats: {
    totalPot: new BigNumber(0),
    totalRake: new BigNumber(0),
  },
  playerStats: Object.fromEntries(
    players.map((player) => [
      player.name,
      {
        streets: {},
        aggressiveActionCount: 0,
        totalActionCount: 0,
        totalAwarded: new BigNumber(0),
        totalContributed: new BigNumber(0),
        totalRakeContributed: new BigNumber(0),
        totalWon: new BigNumber(0),
        vpip: false,
        wentToShowdown: false,
      } satisfies PlayerStatsState,
    ]),
  ),
});

const defaultStreetStats: StreetStat = {
  betCount: 0,
  callCount: 0,
  checkCount: 0,
  foldCount: 0,
  raiseCount: 0,
  bets: {},
};

const updatePlayerStats = (
  state: State,
  playerName: string,
  callback: (stats: PlayerStatsState) => Partial<PlayerStatsState>,
): AllPlayerStatsState => {
  const stats = state.playerStats[playerName];
  if (stats === undefined) {
    return state.playerStats;
  }
  return {
    ...state.playerStats,
    [playerName]: merge(stats, callback(stats)),
  };
};

interface ApplyOptions<TAction extends Action> {
  state: State;
  action: TAction;
}

const applyDealBoard = ({ state, action }: ApplyOptions<DealBoardAction>): State => ({
  ...state,
  currentStreet: action.street,
  currentStreetRaiseCount: 0,
});

const applyPost = ({ state, action }: ApplyOptions<PostAction>): State => ({
  ...state,
  handStats: {
    ...state.handStats,
    totalPot: state.handStats.totalPot.plus(action.amount),
  },
  playerStats: updatePlayerStats(state, action.playerName, ({ totalContributed, totalWon }) => ({
    totalContributed: totalContributed.plus(action.amount),
    totalWon: totalWon.minus(action.amount),
  })),
});

const applyBet = ({ state, action }: ApplyOptions<BetAction>): State => ({
  ...state,
  handStats: {
    ...state.handStats,
    totalPot: state.handStats.totalPot.plus(action.amount),
  },
  playerStats: updatePlayerStats(
    state,
    action.playerName,
    ({ aggressiveActionCount, streets, totalActionCount, totalContributed, totalWon }) => ({
      aggressiveActionCount: aggressiveActionCount + 1,
      totalActionCount: totalActionCount + 1,
      totalContributed: totalContributed.plus(action.amount),
      totalWon: totalWon.minus(action.amount),
      vpip: true,
      streets: {
        [state.currentStreet]: {
          ...defaultStreetStats,
          ...streets[state.currentStreet],
          betCount: (streets[state.currentStreet]?.betCount ?? 0) + 1,
        },
      },
    }),
  ),
});

const applyCall = ({ state, action }: ApplyOptions<CallAction>): State => ({
  ...state,
  handStats: {
    ...state.handStats,
    totalPot: state.handStats.totalPot.plus(action.amount),
  },
  playerStats: updatePlayerStats(
    state,
    action.playerName,
    ({ streets, totalActionCount, totalContributed, totalWon }) => ({
      totalActionCount: totalActionCount + 1,
      totalContributed: totalContributed.plus(action.amount),
      totalWon: totalWon.minus(action.amount),
      vpip: true,
      streets: {
        [state.currentStreet]: {
          ...defaultStreetStats,
          ...streets[state.currentStreet],
          callCount: (streets[state.currentStreet]?.callCount ?? 0) + 1,
        },
      },
    }),
  ),
});

const applyCheck = ({ state, action }: ApplyOptions<CheckAction>): State => ({
  ...state,
  playerStats: updatePlayerStats(state, action.playerName, ({ streets, totalActionCount }) => ({
    totalActionCount: totalActionCount + 1,
    streets: {
      [state.currentStreet]: {
        ...defaultStreetStats,
        ...streets[state.currentStreet],
        checkCount: (streets[state.currentStreet]?.checkCount ?? 0) + 1,
      },
    },
  })),
});

const applyFold = ({ state, action }: ApplyOptions<FoldAction>): State => ({
  ...state,
  playerStats: updatePlayerStats(state, action.playerName, ({ streets, totalActionCount }) => ({
    totalActionCount: totalActionCount + 1,
    streets: {
      [state.currentStreet]: {
        ...defaultStreetStats,
        ...streets[state.currentStreet],
        foldCount: (streets[state.currentStreet]?.foldCount ?? 0) + 1,
      },
    },
  })),
});

const applyRaise = ({ state, action }: ApplyOptions<RaiseAction>): State => ({
  ...state,
  currentStreetRaiseCount: state.currentStreetRaiseCount + 1,
  handStats: {
    ...state.handStats,
    totalPot: state.handStats.totalPot.plus(action.amount),
  },
  playerStats: updatePlayerStats(
    state,
    action.playerName,
    ({ aggressiveActionCount, streets, totalActionCount, totalContributed, totalWon }) => ({
      aggressiveActionCount: aggressiveActionCount + 1,
      totalActionCount: totalActionCount + 1,
      totalContributed: totalContributed.plus(action.amount),
      totalWon: totalWon.minus(action.amount),
      vpip: true,
      streets: {
        [state.currentStreet]: {
          ...defaultStreetStats,
          ...streets[state.currentStreet],
          raiseCount: (streets[state.currentStreet]?.raiseCount ?? 0) + 1,
          bets: {
            ...streets[state.currentStreet]?.bets,
            [state.currentStreetRaiseCount + 1]: 1,
          },
        },
      },
    }),
  ),
});

const applyReturnBet = ({ state, action }: ApplyOptions<ReturnBetAction>): State => ({
  ...state,
  handStats: {
    ...state.handStats,
    totalPot: state.handStats.totalPot.minus(action.amount),
  },
  playerStats: updatePlayerStats(state, action.playerName, ({ totalContributed, totalWon }) => ({
    totalContributed: totalContributed.minus(action.amount),
    totalWon: totalWon.plus(action.amount),
  })),
});

const applyShowdown = ({ state, action }: ApplyOptions<ShowdownAction>): State => ({
  ...state,
  playerStats: updatePlayerStats(state, action.playerName, () => ({
    wentToShowdown: true,
  })),
});

const applyAwardPot = ({ state, action }: ApplyOptions<AwardPotAction>): State => ({
  ...state,
  playerStats: updatePlayerStats(state, action.playerName, ({ totalAwarded, totalWon }) => ({
    totalAwarded: totalAwarded.plus(action.amount),
    totalWon: totalWon.plus(action.amount),
  })),
});

export const applyAction = ({ state, action }: ApplyOptions<Action>): State => {
  const { type } = action;
  switch (type) {
    case 'award-pot':
      return applyAwardPot({ state, action });
    case 'bet':
      return applyBet({ state, action });
    case 'call':
      return applyCall({ state, action });
    case 'check':
      return applyCheck({ state, action });
    case 'deal-board':
      return applyDealBoard({ state, action });
    case 'fold':
      return applyFold({ state, action });
    case 'post':
      return applyPost({ state, action });
    case 'raise':
      return applyRaise({ state, action });
    case 'return-bet':
      return applyReturnBet({ state, action });
    case 'showdown':
      return applyShowdown({ state, action });
    case 'deal-hand':
      return state;
    default:
      return assertNever(type);
  }
};
