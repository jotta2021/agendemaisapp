import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const api = axios.create({
  baseURL: "https://agende-api.onrender.com",
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
