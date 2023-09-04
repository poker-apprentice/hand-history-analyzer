import {
  Action,
  BetAction,
  CallAction,
  PostAction,
  RaiseAction,
} from '@poker-apprentice/hand-history-parser';
import { isVpipAction } from './isVpipAction';

export const isContributeToPotAction = (
  action: Action,
): action is BetAction | CallAction | PostAction | RaiseAction =>
  action.type === 'post' || isVpipAction(action);
