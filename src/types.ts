import type { Street } from '@poker-apprentice/hand-history-parser';

export interface StreetStat {
  /**
   * The number of bets made by a player during a specific street.
   */
  betCount: number;
  /**
   * The number of calls made by a player during a specific street.
   */
  callCount: number;
  /**
   * The number of checks made by a player during a specific street.
   */
  checkCount: number;
  /**
   * The number of folds made by a player during a specific street.
   */
  foldCount: number;
  /**
   * The number of raises made by a player during a specific street.
   */
  raiseCount: number;
  /**
   * The number of times a player 2-bet, 3-bet, etc. during a specific street.
   */
  bets: { [nbet: number]: number };
}

export type StreetStats = Partial<Record<Street, StreetStat>>;

export interface HandStats {
  /**
   * The total amount of chips contributed to the pot by all players.
   */
  totalPot: string;
  /**
   * The amount of rake collected by the site.
   */
  totalRake: string;
}

export interface PlayerStats {
  /**
   * The number of aggressive actions (bets or raises) made by the player throughout the hand.
   */
  aggressiveActionCount: number;
  /**
   * Statistics broken down by street.
   */
  streets: StreetStats;
  /**
   * The number of aggressive actions (checks, bets, calls, or raises) made by the player
   * throughout the hand.
   */
  totalActionCount: number;
  /**
   * The amount of chips awarded to the player from the pot.
   */
  totalAwarded: string;
  /**
   * The amount of chips contributed to the pot by the player.
   */
  totalContributed: string;
  /**
   * The amount of rake taken from the pot proportional to the percentage of the pot won by that
   * player.
   */
  totalRakeContributed: string;
  /**
   * The amount of chips won or lost by the player after accounting for chips contributed to the pot.
   */
  totalWon: string;
  /**
   * The monetary value of any tournament prizes won, where the denomination matches the currency
   * represented by the associated game.
   */
  tournamentPlacementPrize: string;
  /**
   * The monetary value of any bounties won during the hand, where the denomination matches the
   * currency represented by the associated game.
   */
  bountiesWon: string;
  /**
   * Whether the player voluntarily put chips into the pot.
   */
  vpip: boolean;
  /**
   * Whether the player went to showdown.
   */
  wentToShowdown: boolean;
}

/**
 * Calculated stats based upon the hand history.
 */
export interface HandHistoryStats {
  /**
   * Analysis of the overall hand.
   */
  hand: HandStats;
  /**
   * Analysis of each player involved in the hand, keyed by the player's username. This object will
   * contain an entry for every player unless the site treats players as anonymous. In such cases,
   * only the hero's username & data will be included.
   */
  players: Record<string, PlayerStats>;
}
