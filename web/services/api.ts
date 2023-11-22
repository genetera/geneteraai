import axios from "axios";
import Cookies from "js-cookie";

const unAuthorizedStatus = [401];
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status }: any = error.response;
    if (unAuthorizedStatus.includes(status)) {
      Cookies.remove("refreshToken", { path: "/" });
      Cookies.remove("accessToken", { path: "/" });
      if (window.location.pathname != "/")
        window.location.href = "/?next_url=window.location.pathname";
    }
    return Promise.reject(error);
  }
);

abstract class APIService {
  protected baseURL: any;
  protected headers: any = {};

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  getAccessToken() {
    return Cookies.get("accessToken");
  }

  setAccessToken(token: string) {
    Cookies.set("accessToken", token);
  }

  removeAccessToken() {
    Cookies.remove("accessToken", { path: "/" });
  }

  getRefreshToken() {
    return Cookies.get("refreshToken");
  }

  setRefreshToken(token: string) {
    Cookies.set("refreshToken", token);
  }

  removeRefreshToken() {
    Cookies.remove("refreshToken", { path: "/" });
  }

  getHeaders() {
    return {
      Authorization: `Bearer ${this.getAccessToken()}`,
    };
  }

  get(url: string, config = {}): Promise<any> {
    return axios({
      method: "get",
      url: this.baseURL + url,
      headers: this.getAccessToken() ? this.getHeaders() : {},
      ...config,
    });
  }

  post(url: string, data = {}, config = {}): Promise<any> {
    return axios({
      method: "post",
      url: this.baseURL + url,
      data,
      headers: this.getAccessToken() ? this.getHeaders() : {},
      ...config,
    });
  }

  put(url: string, data = {}, config = {}): Promise<any> {
    return axios({
      method: "put",
      url: this.baseURL + url,
      data,
      headers: this.getAccessToken() ? this.getHeaders() : {},
      ...config,
    });
  }

  patch(url: string, data = {}, config = {}): Promise<any> {
    return axios({
      method: "get",
      url: this.baseURL + url,
      data,
      headers: this.getAccessToken() ? this.getHeaders() : {},
      ...config,
    });
  }

  delete(url: string, data?: any, config = {}): Promise<any> {
    return axios({
      method: "delete",
      url: this.baseURL + url,
      data: data,
      headers: this.getAccessToken() ? this.getHeaders() : {},
      ...config,
    });
  }

  mediaUpload(url: string, data = {}, config = {}): Promise<any> {
    return axios({
      method: "post",
      url: this.baseURL + url,
      data: data,
      headers: this.getAccessToken()
        ? { ...this.getHeaders(), "Content-Type": "multipart/form-data" }
        : {},
    });
  }
}

export default APIService;
