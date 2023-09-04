import type {
  Action,
  AwardPotAction,
  BetAction,
  CallAction,
  CheckAction,
  FoldAction,
  MuckAction,
  PostAction,
  RaiseAction,
  ReturnBetAction,
  ShowdownAction,
} from '@poker-apprentice/hand-history-parser';

export type PlayerAction =
  | AwardPotAction
  | BetAction
  | CallAction
  | CheckAction
  | FoldAction
  | MuckAction
  | PostAction
  | RaiseAction
  | ReturnBetAction
  | ShowdownAction;

export const isPlayerAction = (action: Action): action is PlayerAction =>
  action.type === 'award-pot' ||
  action.type === 'bet' ||
  action.type === 'call' ||
  action.type === 'check' ||
  action.type === 'fold' ||
  action.type === 'muck' ||
  action.type === 'post' ||
  action.type === 'raise' ||
  action.type === 'return-bet' ||
  action.type === 'showdown';
