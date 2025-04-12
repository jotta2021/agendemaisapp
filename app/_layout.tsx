import { Stack } from "expo-router";
import useFonts from "./hooks/useFonts";
import { Text, View } from "react-native";
import { ToastProvider } from "react-native-toast-notifications";
import Contexts from "./_contexts";
import colors from "@/assets/colors";
export default function RootLayout() {
  const fontsLoaded = useFonts();
  if (!fontsLoaded) {
    return <View></View>;
  }

  return (
    <Contexts>
      <ToastProvider placement="top">
        <Stack
        screenOptions={{
          statusBarBackgroundColor:colors.primary
        }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="introduction"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="initial"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="settingsPages/mydata"
            options={{
              title: "Meus dados",
              headerBackTitle: "Voltar",
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: "white",
            }}
          />
           <Stack.Screen
            name="settingsPages/security"
            options={{
              title: "Segurança",
              headerBackTitle: "Voltar",
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: "white",
            }}
          />
            <Stack.Screen
            name="settingsPages/profissionals/profissionals"
            options={{
              title: "Profissionais",
              headerBackTitle: "Voltar",
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: "white",
            }}
          />
           <Stack.Screen
            name="settingsPages/profissionals/[id]"
            options={{
              title: "Profissional",
              headerBackTitle: "Voltar",
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: "white",
            }}
          />

            <Stack.Screen
            name="addService/[id]"
            options={{
              title: "Serviços",
              headerBackTitle: "Voltar",
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: "white",
            }}
          />
            <Stack.Screen
            name="addCategory/[id]"
            options={{
              title: "Categorias",
              headerBackTitle: "Voltar",
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: "white",
            }}
          />
        </Stack>
      </ToastProvider>
    </Contexts>
  );
}
