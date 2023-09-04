import { Action, HandHistory } from '@poker-apprentice/hand-history-parser';
import BigNumber from 'bignumber.js';
import { HandHistoryStats } from './types';
import { isAwardPotAction } from './utils/isAwardPotAction';
import { isContributeToPotAction } from './utils/isContributeToPotAction';
import { isPlayerAction } from './utils/isPlayerAction';
import { isReturnBetAction } from './utils/isReturnBetAction';
import { isVpipAction } from './utils/isVpipAction';
import { sum } from './utils/sum';

// TODO: rounding should be based upon currency's precision (or whole number for tourneys)
const round = (num: BigNumber, _currency: string) =>
  new BigNumber(num.toFormat(2, BigNumber.ROUND_HALF_UP));

export interface AnalyzeStatsOptions {
  /**
   * A `HandHistory` object returned by the `parseHand` function provided by
   * the `@poker-apprentice/hand-history-parser` package.
   */
  handHistory: HandHistory;
  /**
   * The display name of the player whose stats should be calculated.
   */
  playerName: string;
}

export class AnalyzeStats {
  private handHistory: HandHistory;
  private playerName: string;

  constructor({ handHistory, playerName }: AnalyzeStatsOptions) {
    this.handHistory = handHistory;
    this.playerName = playerName;

    const player = this.handHistory.players.find(({ name }) => name === this.playerName);
    if (!player) {
      throw new Error('Player not found');
    }
  }

  public analyze(): HandHistoryStats {
    return {
      aggressiveActionCount: this.aggressiveActionCount,
      totalActionCount: this.totalActionCount,
      totalPot: this.chipsContributedByEveryone.toString(),
      totalRake: this.totalRake.toString(),
      totalRakeContributed: this.totalRakeContributedByPlayer.toString(),
      totalWon: this.totalWonByPlayer.toString(),
      vpip: this.vpip,
    };
  }

  // TODO: all getters in this class should be memoized
  private get actions(): Action[] {
    return this.handHistory.actions;
  }

  private get currentPlayerActions() {
    return this.actions
      .filter(isPlayerAction)
      .filter((action) => action.playerName === this.playerName);
  }

  private get vpipActions() {
    return this.currentPlayerActions.filter(isVpipAction);
  }

  private get vpip() {
    return this.vpipActions.length > 0;
  }

  private get totalActionCount() {
    return this.currentPlayerActions.filter(
      (action: Action) => action.type === 'check' || isVpipAction(action),
    ).length;
  }

  private get aggressiveActionCount() {
    return this.vpipActions.filter((action) => action.type === 'bet' || action.type === 'raise')
      .length;
  }

  private get chipsContributedByEveryone() {
    const chipsReturnedToEveryone = sum(this.actions.filter(isReturnBetAction));
    return sum(this.actions.filter(isContributeToPotAction)).minus(chipsReturnedToEveryone);
  }

  private get chipsAwardedToPlayer() {
    return sum(this.currentPlayerActions.filter(isAwardPotAction));
  }

  private get chipsAwardedToEveryone() {
    return sum(this.actions.filter(isAwardPotAction));
  }

  private get chipsContributedByPlayer() {
    const chipsReturnedToPlayer = sum(this.currentPlayerActions.filter(isReturnBetAction));
    return sum(this.vpipActions).minus(chipsReturnedToPlayer);
  }

  private get totalWonByPlayer() {
    return this.chipsAwardedToPlayer.minus(this.chipsContributedByPlayer);
  }

  private get totalRake() {
    return this.chipsContributedByEveryone.minus(this.chipsAwardedToEveryone);
  }

  private get totalRakeContributedByPlayer() {
    return round(
      this.totalRake.times(this.chipsAwardedToPlayer.div(this.chipsAwardedToEveryone)),
      this.handHistory.info.currency,
    );
  }
}
