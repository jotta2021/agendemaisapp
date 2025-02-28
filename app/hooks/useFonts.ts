import { useFonts as useExpoFonts } from "expo-font";

export default function useFonts(){
    const [fontsLoaded] =useExpoFonts({
        "Poppins-Regular": require('@/assets/fonts/Poppins-Regular.ttf'),
        "Poppins-Bold": require('@/assets/fonts/Poppins-Bold.ttf'),
        "Poppins-Medium": require('@/assets/fonts/Poppins-Medium.ttf')
    })
    return fontsLoaded;
}