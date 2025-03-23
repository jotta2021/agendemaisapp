import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.3.156:3333",
});
api.interceptors.request.use(
  async(config) => {
    const token =await AsyncStorage.getItem("token");
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
