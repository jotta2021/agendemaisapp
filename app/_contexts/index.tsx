import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import * as Calendar from "expo-calendar";
import * as Notifications from "expo-notifications";
interface User {
  id: string;
  name_enterprise: string;
  email: string;
  remenber: boolean;
}
interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  tokenExp: string | null;

}

export const context = createContext<AppContextType>({} as AppContextType);

const Contexts = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
const [tokenExp, setTokenExp] = useState<string | null>(null);
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

  //permissao para notificacoes e calendario
  
    async function getCalendarPermissions() {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        console.log("Permissão concedida!");
      
      }
    }
  
  
    async function getNotificationPermission() {
      // Primeiramente, verifique o status da permissão
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      
      if (existingStatus === 'granted') {
        console.log('Permissão já concedida');
        return await getPushToken();  // Tente pegar o token diretamente
      }
    
      // Se a permissão ainda não foi concedida, peça a permissão
      const { status } = await Notifications.requestPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('Permissão de notificação não concedida!');
        return;
      }
      
      console.log('Permissão concedida');
      return await getPushToken();  // Chama a função para pegar o token
    }
    
    async function getPushToken() {
      try {
        const token = await Notifications.getExpoPushTokenAsync();
        console.log('Token de push:', token.data);
        setTokenExp(token.data) // Armazena o token no estado
        return token.data;  // Retorna o token de push
      } catch (error) {
        console.error('Erro ao obter o token de push:', error);
      }
    }
    
    useEffect(() => {
      getCalendarPermissions();
      getNotificationPermission()
    }, []);


    //monitora as notificacoes
      const handleNotificationReceived = (notification: Notifications.Notification) => {
        console.log('Nova notificação recebida:', notification);
        
        // Adiciona a nova notificação ao estado
        
      };
      useEffect(() => {
        const notificationListener = Notifications.addNotificationReceivedListener(handleNotificationReceived);
        
        // Limpeza do listener ao desmontar o componente
        return () => {
          notificationListener.remove();
        };
      }, []);
    
      // Listener para quando o usuário interagir com a notificação (exemplo de click)
      useEffect(() => {
        const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
          console.log('Usuário interagiu com a notificação:', response);
          // Ações que você quiser realizar quando o usuário clicar na notificação
        });
    
        // Limpeza do listener ao desmontar o componente
        return () => {
          responseListener.remove();
        };
      }, []);
  return (
    <context.Provider value={{ user, setUser,tokenExp }}>{children}</context.Provider>
  );
};

export default Contexts;
