import Axios from "axios";

export const http = Axios.create({
  baseURL: "http://localhost:3001",
});

http.defaults.withCredentials = true;
