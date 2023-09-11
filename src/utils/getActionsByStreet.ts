import type { Action, Street } from '@poker-apprentice/hand-history-parser';

export type ActionsByStreet = Record<Street, Action[]>;

export const getActionsByStreet = (actions: Action[]): ActionsByStreet => {
  const actionsByStreet: ActionsByStreet = {
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
