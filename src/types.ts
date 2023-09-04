export interface HandHistoryStats {
  /**
   * The number of aggressive actions (bets or raises) made by the player throughout the hand.
   */
  aggressiveActionCount: number;
  /**
   * The number of aggressive actions (checks, bets, calls, or raises) made by the player
   * throughout the hand.
   */
  totalActionCount: number;
  /**
   * The total amount of chips contributed to the pot by all players.
   */
  totalPot: string;
  /**
   * The amount of rake collected by the site.
   */
  totalRake: string;
  /**
   * The amount of rake taken from the pot proportional to the percentage of the pot won by that
   * player.
   */
  totalRakeContributed: string;
  /**
   * The amount of chips won or lost by the player.
   */
  totalWon: string;
  /**
   * Whether the player voluntarily put chips into the pot.
   */
  vpip: boolean;
}
