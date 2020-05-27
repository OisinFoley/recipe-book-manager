import { UserData } from 'src/app/auth/interfaces/user-data';

export class User implements UserData {
  constructor(
    public email: string,
    public userId: string,
    public token: string,
    public tokenExpirationDate: Date
  ) {}
}
