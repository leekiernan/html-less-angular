import { ActionReducer } from '@ngrx/store';
import { NewQuote, ExtendedAction } from '../models';

export const QUOTE_CHANGED = "QUOTE_CHANGED";

export function quoteReducer(state:NewQuote, { type, payload }:ExtendedAction) {
  switch(type) {
    case QUOTE_CHANGED:
      // Here we add just the payload to the session data.
      return payload;
    default: return state;
  }
}
