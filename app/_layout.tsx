import { Stack } from "expo-router";
import useFonts from "./hooks/useFonts";
import { Text,View } from "react-native";
export default function RootLayout() {
  const fontsLoaded = useFonts();
  if(!fontsLoaded){
    return (
      <View></View>
    )
  }
  return (
      <Stack>
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
    </Stack>
  
    
  );
}
