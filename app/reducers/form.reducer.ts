import { ActionReducer } from '@ngrx/store';
import { Form, ExtendedAction } from '../models';

export const FORM_CHANGED = "FORM_CHANGED";

export function formReducer(state:Form, { type, payload }:ExtendedAction) {
  switch(type) {
    case FORM_CHANGED:
      // The session data becomes the payload, including a timestamp of when this change was made.
      return Object.assign(payload, { timestamp: Date.now() });
    default: return state;
  }
}
