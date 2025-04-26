import { Stack } from "expo-router";
import useFonts from "./hooks/useFonts";
import { Text, View, Platform, StyleSheet } from "react-native";
import { ToastProvider } from "react-native-toast-notifications";
import Contexts from "./_contexts";
import colors from "@/assets/colors";
import CardDownloadApp from "./_components/CardDownloadApp";
import { useState } from "react";

export default function RootLayout() {
  const fontsLoaded = useFonts();
  const [open, setOpen] = useState(true);

  if (!fontsLoaded) {
    return <View style={styles.container} />;
  }

  const Content = (
    <ToastProvider placement="top">
      {Platform.OS === "web" && open ? (
        <CardDownloadApp setOpen={setOpen} />
      ) : null}

      <Stack
        screenOptions={{
          statusBarBackgroundColor: colors.primary,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="introduction" options={{ headerShown: false }} />
        <Stack.Screen name="initial" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="settingsPages/mydata"
          options={{
            title: "Meus dados",
            headerBackTitle: "Voltar",
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="settingsPages/security"
          options={{
            title: "Segurança",
            headerBackTitle: "Voltar",
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="settingsPages/profissionals/profissionals"
          options={{
            title: "Profissionais",
            headerBackTitle: "Voltar",
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="settingsPages/profissionals/[id]"
          options={{
            title: "Profissional",
            headerBackTitle: "Voltar",
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="addService/[id]"
          options={{
            title: "Serviços",
            headerBackTitle: "Voltar",
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="addCategory/[id]"
          options={{
            title: "Categorias",
            headerBackTitle: "Voltar",
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: "white",
          }}
        />
      </Stack>
    </ToastProvider>
  );

  return (
    <Contexts>
      {Platform.OS === "web" ? (
        <View style={styles.webContainer}>
          {Content}
        </View>
      ) : (
        Content
      )}
    </Contexts>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 600, // Limita no máximo 600px
    alignSelf: "center", // Centraliza no meio da tela
  },
});
