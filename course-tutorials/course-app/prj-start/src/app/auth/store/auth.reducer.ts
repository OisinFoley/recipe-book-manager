import { User } from '../user/user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User;
  authError: string;
  loading: boolean;
}

const initialState = {
  user: null,
  authError: '',
  loading: false
};

export function authReducer(
    state = initialState,
    action: AuthActions.AuthActionsType
  ) {
    switch (action.type) {
      case AuthActions.AUTHENTICATE_SUCCESS:
        const user = new User(
          action.payload.email,
          action.payload.userId,
          action.payload.token,
          action.payload.tokenExpirationDate
        );
        return {
          ...state,
          authError: null,
          loading: false,
          user
        };
      case AuthActions.AUTHENTICATE_FAIL:
        return { ...state, authError: action.payload, loading: false };
      case AuthActions.LOGIN_START:
        return { ...state, authError: null, loading: true };
      case AuthActions.LOGOUT:
        return { ...state, user: null };
      default:
        return state;
    }
}
