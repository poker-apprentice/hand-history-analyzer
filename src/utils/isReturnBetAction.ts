import { Action, ReturnBetAction } from '@poker-apprentice/hand-history-parser';

export const isReturnBetAction = (action: Action): action is ReturnBetAction =>
  action.type === 'return-bet';
