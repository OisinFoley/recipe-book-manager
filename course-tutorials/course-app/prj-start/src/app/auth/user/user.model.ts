import { UserData } from 'src/app/interfaces/user-data';

export class User implements UserData {
  constructor(
    public email: string,
    public userId: string,
    public token: string,
    public tokenExpirationDate: Date
  ) {}

  // get token() {
  //   if (!this.tokenExpirationDate || new Date() > this.tokenExpirationDate) {
  //     return null;
  //   }
  //   return this.token;
  // }
}
