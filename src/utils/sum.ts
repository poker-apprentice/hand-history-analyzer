import type {
  AwardPotAction,
  BetAction,
  CallAction,
  PostAction,
  RaiseAction,
  ReturnBetAction,
} from '@poker-apprentice/hand-history-parser';
import BigNumber from 'bignumber.js';

export type AmountAction =
  | AwardPotAction
  | BetAction
  | CallAction
  | PostAction
  | RaiseAction
  | ReturnBetAction;

export const sum = (actions: AmountAction[]) =>
  actions.reduce((total, action) => total.plus(action.amount), new BigNumber(0));
