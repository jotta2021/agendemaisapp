import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { createContext, ReactNode, useEffect, useState } from "react";

interface User {
  id: string;
  name_enterprise: string;
  email: string;
  remenber: boolean;
}
interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const context = createContext<AppContextType>({} as AppContextType);

const Contexts = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  //verifica se tem dados do usuario armazenados
  async function getUser(){
    const userData = await AsyncStorage.getItem('user')
    if(userData){
        setUser(JSON.parse(userData))
    }
  }

  useEffect(()=> {
    getUser()
  },[])

  return (
    <context.Provider value={{ user, setUser }}>{children}</context.Provider>
  );
};

export default Contexts;
