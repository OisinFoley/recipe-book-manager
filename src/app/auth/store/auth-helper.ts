import { User } from '../models/user.model';
import { State as AuthState } from '../store/auth.reducer';
import { mockDefaultAppState } from 'src/app/shared/utils/test-helpers';
import { Constants } from 'src/app/shared/constants';
import { throwError } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';

export class MockAuthFail {
  error = { error: { message: '' } };
  constructor(arg: string) {
    this.error.error.message = arg;
  }
}

const {
  emailAlreadyExists,
  emailNotFound,
  invalidPassword
} = Constants.firebaseAuthErrors;

const validAuthEmail = 'valid@email.com';
const validAuthPassword = 'testPassword123';
const existingAuthEmail = 'already_exists@email.com';
const invalidAuthPassword = 'invalidPassword123';
const notFoundAuthEmail = '';

// Random timestamp set in the year 2040 (value not critical to any test)
export const mockTokenExpirationTimestamp = 2221165657;

export const mockUser = new User(
  'test@email.com',
  'test_userId',
  'test_token',
  new Date(mockTokenExpirationTimestamp)
);

export const mockAuthResponse: AuthResponse = {
  expiresIn: mockUser.tokenExpirationDate.getTime().toString(),
  email: mockUser.email,
  localId: mockUser.userId,
  idToken: mockUser.token
};

export const expectedAuthSuccessSetLocalStorageUser = {
  ...mockUser,
  tokenExpirationDate: new Date(mockTokenExpirationTimestamp * 1000).toISOString()
};

const mockUnAuthorisedState: AuthState = {
  user: null,
  authError: '',
  loading: false
};

export const mockAuthorisedState: AuthState = {
  user: mockUser,
  authError: '',
  loading: false
};

export const mockUnAuthorisedComponentState = {
  ...mockDefaultAppState,
  auth: {
    ...mockUnAuthorisedState
  }
};

export const mockAuthorisedComponentState = {
  ...mockDefaultAppState,
  auth: {
    ...mockAuthorisedState
  }
};

export const mockAuthSuccessPayload = {
  ...mockUser,
  redirect: true
};

export const testErrorMsg = 'test_error';

export const mockAuthPayloadValues =  {
  email: validAuthEmail,
  password: validAuthPassword
};

export const mockEmailNotFoundPayload = { ...mockAuthPayloadValues, email: notFoundAuthEmail };
export const mockInvalidPasswordPayload = { ...mockAuthPayloadValues, password: invalidAuthPassword };
export const mockEmailAlreadyExistsPayload = { ...mockAuthPayloadValues, email: existingAuthEmail };

export const mockEmailNotFoundRequestPayload = {
  ...mockEmailNotFoundPayload,
  returnSecureToken: true
};

export const mockInvalidPasswordRequestPayload = {
  ...mockInvalidPasswordPayload,
  returnSecureToken: true
};

export const mockEmailAlreadyExistsRequestPayload = {
  ...mockEmailAlreadyExistsPayload,
  returnSecureToken: true
};

export const mockEmptyAuthRequestPayload = {
  email: undefined,
  password: undefined,
  returnSecureToken: true
};

export const setHttpStubReturnValues = (httpService) => {
  httpService.post
    .withArgs(
      Constants.firebaseSignInUrl,
      mockEmailNotFoundRequestPayload
    )
    .and.returnValue(
      throwError(new MockAuthFail(emailNotFound))
    )
    .withArgs(
      Constants.firebaseSignInUrl,
      mockInvalidPasswordRequestPayload
    )
    .and.returnValue(
      throwError(new MockAuthFail(invalidPassword))
    )
    .withArgs(
      Constants.firebaseSignUpUrl,
      mockEmailAlreadyExistsRequestPayload
    )
    .and.returnValue(
      throwError(new MockAuthFail(emailAlreadyExists))
    )
    .withArgs(
      Constants.firebaseSignUpUrl,
      mockEmptyAuthRequestPayload
    )
    .and.returnValue(
      throwError({})
    );
};
