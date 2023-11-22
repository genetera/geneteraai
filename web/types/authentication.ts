export interface ISignInCredentials {
  email: string;
  password: string;
}

export interface ISignUpCredentials {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  confirm_password: string;
}

export interface IForgotPassword {
  email: string;
}

export interface IGoogleSignIn {
  credential: string;
  clientId: string;
}
