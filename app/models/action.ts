import { Action } from '@ngrx/store';

// For reducers.
export interface ExtendedAction extends Action {
  type: string;
  payload?: any;
}
