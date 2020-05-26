import { Action } from '@ngrx/store';

export const DUMMY = '[Dummy] DUMMY';
export class DummyAction implements Action {
  readonly type = DUMMY;
  constructor(public payload?: null) {}
}
