import { UserData } from 'src/app/interfaces/user-data';

export class User implements UserData {
  constructor(
    public email: string,
    public _id: string,
    public _token: string,
    public _tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}
