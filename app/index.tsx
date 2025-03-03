import { Image, StyleSheet, Text, View,Animated } from "react-native";
import colors from "@/assets/colors";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen() {
const [fadeIn] = useState(new Animated.Value(0))
const router = useRouter()

useEffect(()=> {
function fadeOut(){
  Animated.timing(fadeIn,{
    toValue:1,
    duration:1000,
    useNativeDriver:true
  }).start()
}
function FadeIn(){
  Animated.timing(fadeIn,{
    toValue:0,
    duration:1000,
    useNativeDriver:true
  }).start()
}

let user: string | null = null;
  async function verifyLogin() {
    const userData = await AsyncStorage.getItem("token");  
    user = userData
  }
verifyLogin()
fadeOut()
setTimeout(()=> {
  FadeIn()
  setTimeout(()=> {
    if(user){
      router.replace('/(tabs)')
    }else{
      router.replace('/introduction')
    }

  },1000)
 
},1500)


},[])

  return (
    <View style={styles.container}>
      <Animated.View style={{opacity:fadeIn}}>
          <Image
        source={require("@/assets/images/logo.png")}
        style={styles.image}
      />
      </Animated.View>
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  image: {
    width: 120,
    height: 120,
  },
});
