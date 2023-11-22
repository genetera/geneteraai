import APIService from "@/services/api";
import {
  ISignInCredentials,
  ISignUpCredentials,
  IForgotPassword,
  IGoogleSignIn,
} from "@/types/authentication";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

class AuthenticationService extends APIService {
  constructor() {
    const BASE_URL = API_BASE_URL + "auth/";

    super(BASE_URL as string);
  }

  async signIn(data: ISignInCredentials) {
    return this.post("sign-in/", data)
      .then((response) => {
        this.setAccessToken(response?.data?.access_token);
        this.setRefreshToken(response?.data?.refresh_token);
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async googleSignIn(data: IGoogleSignIn) {
    return this.post("social/google/sign-in", data)
      .then((response) => {
        this.setAccessToken(response?.data?.access_token);
        this.setRefreshToken(response?.data?.refresh_token);
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async signUp(data: ISignUpCredentials) {
    return this.post("sign-up/", data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async forgotPassword(data: IForgotPassword) {
    return this.post("forgot-password/", data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async signOut(data: { refresh_token: string }) {
    return this.post("sign-out/", data)
      .then((response) => {
        this.removeAccessToken();
        this.removeRefreshToken();
        return response?.data;
      })
      .catch((error) => {
        throw error?.response?.data;
      });
  }
}

export default new AuthenticationService();
