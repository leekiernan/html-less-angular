import { ActionReducer } from '@ngrx/store';
import { ExtendedAction } from '../models';

const TIMEOUT = 30 * 60;
const MSEC = 1000;
const INITIAL = () => (Date.now() + TIMEOUT * MSEC);

export const START_TIMER = 'START';
export const STOP_TIMER = 'STOP';
export const PAUSE_TIMER = 'PAUSE';
export const RESET_TIMER = 'RESET';
export const CLEAR_TIMER = 'CLEAR';
export const SET_TIMER = 'SET';

export function timeoutReducer(state:number = 0, { type, payload }:ExtendedAction) {
  // let timeoutTime = Date.now() + TIMEOUT * MSEC;

  switch(type) {
    case START_TIMER:
    case RESET_TIMER:
      return INITIAL();
    case PAUSE_TIMER:
    case CLEAR_TIMER:
      // return 9999999999999;
    case STOP_TIMER:
      return 0;
    case SET_TIMER:
      return payload;
    default:
      return state;
  }
}
