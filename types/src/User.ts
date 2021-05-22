export class User {
  email: string = "";
  username: string = "";

  constructor(user: User) {
    Object.assign(this, user);
  }
}

export class UserAuth extends User {
  salt: string = "";
  sha: string = "";

  constructor(auth: UserAuth) {
    super(auth);
    Object.assign(this, auth);
  }
}

export class UserAuthRequest extends User {
  password: string = "";
  constructor(auth: UserAuthRequest) {
    super(auth);
    Object.assign(this, auth);
  }
}

export default {
  User,
  UserAuth,
  UserAuthRequest,
};
