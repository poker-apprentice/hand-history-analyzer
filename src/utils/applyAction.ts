import {
  Action,
  AwardPotAction,
  BetAction,
  CallAction,
  CheckAction,
  DealBoardAction,
  FoldAction,
  MuckAction,
  Player,
  PostAction,
  RaiseAction,
  ReturnBetAction,
  ShowdownAction,
  Street,
} from '@poker-apprentice/hand-history-parser';
import assertNever from 'assert-never';
import BigNumber from 'bignumber.js';
import merge from 'lodash/merge';
import { HandStats, PlayerStats, StreetStat } from '../types';

interface CalculatedHandStats extends Omit<HandStats, 'totalPot' | 'totalRake'> {
  totalPot: BigNumber;
  totalRake: BigNumber;
}

interface CalculatedPlayerStats
  extends Omit<
    PlayerStats,
    'totalAwarded' | 'totalContributed' | 'totalRakeContributed' | 'totalWon'
  > {
  totalAwarded: BigNumber;
  totalContributed: BigNumber;
  totalRakeContributed: BigNumber;
  totalWon: BigNumber;
}

type AllCalculatedPlayerStats = Record<string, CalculatedPlayerStats>;

export interface CalculatedState {
  currentStreet: Street;
  currentStreetRaiseCount: number;
  handStats: CalculatedHandStats;
  playerStats: AllCalculatedPlayerStats;
}

export const getInitialState = (players: Player[]): CalculatedState => ({
  currentStreet: 'preflop',
  currentStreetRaiseCount: 0,
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
      } satisfies CalculatedPlayerStats,
    ]),
  ),
});

const defaultStreetStats: StreetStat = {
  betCount: 0,
  callCount: 0,
  checkCount: 0,
  foldCount: 0,
  raiseCount: 0,
};

const updatePlayerStats = (
  state: CalculatedState,
  playerName: string,
  callback: (stats: CalculatedPlayerStats) => Partial<CalculatedPlayerStats>,
): AllCalculatedPlayerStats => {
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
  state: CalculatedState;
  action: TAction;
}

const applyDealBoard = ({ state, action }: ApplyOptions<DealBoardAction>): CalculatedState => ({
  ...state,
  currentStreet: action.street,
  currentStreetRaiseCount: 0,
});

const applyPost = ({ state, action }: ApplyOptions<PostAction>): CalculatedState => ({
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

const applyBet = ({ state, action }: ApplyOptions<BetAction>): CalculatedState => ({
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
          betCount: (streets[state.currentStreet]?.betCount ?? 0) + 1,
        },
      },
    }),
  ),
});

const applyCall = ({ state, action }: ApplyOptions<CallAction>): CalculatedState => ({
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

const applyCheck = ({ state, action }: ApplyOptions<CheckAction>): CalculatedState => ({
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

const applyFold = ({ state, action }: ApplyOptions<FoldAction>): CalculatedState => ({
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

const applyRaise = ({ state, action }: ApplyOptions<RaiseAction>): CalculatedState => ({
  ...state,
  currentStreetRaiseCount: state.currentStreetRaiseCount + 1,
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
          raiseCount: (streets[state.currentStreet]?.raiseCount ?? 0) + 1,
        },
      },
    }),
  ),
});

const applyReturnBet = ({ state, action }: ApplyOptions<ReturnBetAction>): CalculatedState => ({
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

const applyShowdown = ({ state, action }: ApplyOptions<ShowdownAction>): CalculatedState => ({
  ...state,
  playerStats: updatePlayerStats(state, action.playerName, () => ({
    wentToShowdown: true,
  })),
});

const applyMuck = ({ state, action }: ApplyOptions<MuckAction>): CalculatedState => ({
  ...state,
  playerStats: updatePlayerStats(state, action.playerName, () => ({
    wentToShowdown: true,
  })),
});

const applyAwardPot = ({ state, action }: ApplyOptions<AwardPotAction>): CalculatedState => ({
  ...state,
  playerStats: updatePlayerStats(state, action.playerName, ({ totalAwarded, totalWon }) => ({
    totalAwarded: totalAwarded.plus(action.amount),
    totalWon: totalWon.plus(action.amount),
  })),
});

export const applyAction = ({ state, action }: ApplyOptions<Action>): CalculatedState => {
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
    case 'muck':
      return applyMuck({ state, action });
    case 'post':
      return applyPost({ state, action });
    case 'raise':
      return applyRaise({ state, action });
    case 'return-bet':
      return applyReturnBet({ state, action });
    case 'showdown':
      return applyShowdown({ state, action });
    case 'board':
      return state;
    case 'deal-hand':
      return state;
    default:
      return assertNever(type);
  }
};
