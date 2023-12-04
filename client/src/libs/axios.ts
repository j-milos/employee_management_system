import Axios, { AxiosRequestConfig } from "axios";

export const http = Axios.create({
  baseURL: "http://localhost:3001",
});

http.defaults.withCredentials = true;

const authRequestInterceptor: any = (config: AxiosRequestConfig) => {
  config.headers = config.headers ?? {};

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  config.headers.Accept = "application/json";
  config.headers["Content-Type"] = "application/json";
  return config;
};

http.interceptors.request.use(authRequestInterceptor);
