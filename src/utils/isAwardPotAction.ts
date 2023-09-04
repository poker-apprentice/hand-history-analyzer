import { Action, AwardPotAction } from '@poker-apprentice/hand-history-parser';

export const isAwardPotAction = (action: Action): action is AwardPotAction =>
  action.type === 'award-pot';
