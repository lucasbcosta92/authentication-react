import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";
import { singOut } from "../contexts/AuthContexts";

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestQueue = []; // Fila

export const api = axios.create({
  baseURL: "http://localhost:3333/",
  headers: {
    Authorization: `Bearer ${cookies["nextauth.token"]}`,
  },
});

// RefreshToken
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response.status === 401) {
      if (error.response.data?.code === "token.expired") {
        // Renovando token
        cookies = parseCookies();
        const { "nextauth.refreshToken": refreshToken } = cookies;
        const originalConfig = error.config;

        if (!isRefreshing) {
          isRefreshing = true;

          api
            .post("/refresh", { refreshToken })
            .then((response) => {
              const { token } = response.data;

              setCookie(undefined, "nextauth.token", token, {
                maxAge: 60 * 60 * 24 * 30, // 30 dias - tempo de expiração
                path: "/", // Caminhos que terão acesso ao cookie - Global
              });

              setCookie(
                undefined,
                "nextauth.refreshToken",
                response.data.refreshToken,
                {
                  maxAge: 60 * 60 * 24 * 30, // 30 dias
                  path: "/",
                }
              );

              api.defaults.headers["Authorization"] = `Bearer ${token}`;
              // Refazendo requests problematicas
              failedRequestQueue.forEach((request) => request.onSuccess(token));
              failedRequestQueue = [];
            })
            .catch((error) => {
              failedRequestQueue.forEach((request) => request.onSuccess(error));
              failedRequestQueue = [];
            })
            .finally(() => {
              isRefreshing = false;
            });
        }

        // Checa qual request deu problema por conta de um token não renovado
        return new Promise((resolve, reject) => {
          failedRequestQueue.push({
            // Metodo para refazer a request
            onSuccess: (token: string) => {
              originalConfig.headers["Authorization"] = `Bearer ${token}`;
              resolve(api(originalConfig));
            },
            // Checa se deu ruim no próprio refreshToken
            onFailure: (error: AxiosError) => {
              reject(error);
            },
          });
        });
      } else {
        // Derrubando a sessão do user caso o token seja invalido
        singOut();
      }
    }
    return Promise.reject(error);
  }
);
