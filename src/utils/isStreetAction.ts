import { Action, DealBoardAction } from '@poker-apprentice/hand-history-parser';

export const isStreetAction = (action: Action): action is DealBoardAction =>
  action.type === 'deal-board';
