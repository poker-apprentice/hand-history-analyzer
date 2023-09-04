import { Action, BetAction, CallAction, RaiseAction } from '@poker-apprentice/hand-history-parser';

export const isVpipAction = (action: Action): action is BetAction | CallAction | RaiseAction =>
  action.type === 'bet' || action.type === 'call' || action.type === 'raise';
