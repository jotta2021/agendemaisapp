import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";

const api = axios.create({
  baseURL: "http://192.168.3.156:3333",
});

const isBrowser = typeof window !== "undefined"; // Verifica se está no navegador
const web = Platform.OS === 'web'; // Verifica se está na plataforma web

api.interceptors.request.use(
  async (config) => {
    let token = null;

    if (web && isBrowser) {
      // Verifica se está no navegador
      token = window.localStorage.getItem("token"); // Usa localStorage no navegador
    } else if (!web) {
      // Se não estiver na web (ou seja, no mobile)
      token = await AsyncStorage.getItem("token"); // Usa AsyncStorage no mobile
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
