import type { Action, Street } from '@poker-apprentice/hand-history-parser';

export const getActionsByStreet = (actions: Action[]) => {
  const actionsByStreet: Record<Street, Action[]> = {
    preflop: [],
    flop: [],
    turn: [],
    river: [],
  };

  let currentStreet: Street = 'preflop';
  actions.forEach((action) => {
    if (action.type === 'deal-board') {
      currentStreet = action.street;
    }
    actionsByStreet[currentStreet].push(action);
  });

  return actionsByStreet;
};
