export class AuthService {
  loggedIn = false;

  isAuthenticated() {
    let promise = new Promise(
      (resolve, reject) => {
        setTimeout(() => {
          // resolve({ isAuthenticated: true, name: 'Oisín' })
          resolve(this.loggedIn);
        }, 800);
    });
    return promise;
  }

  login() {
    this.loggedIn = true;
  }

  logout() {
    this.loggedIn = false;
  }
}