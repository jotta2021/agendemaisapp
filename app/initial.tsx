import colors from "@/assets/colors";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useMemo, useRef, useState } from "react";
import {
  Image,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Button,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Login from "./_components/login";
import Register from "./_components/register";


const width = Dimensions.get("screen").width;
const InitialHome = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [page,setPage] = useState('')
  const snapPoints = useMemo(() => ["95%"], []);

  const handleClosePress = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
      
    }
  };
  const handleOpenPress = (page:string) => {
    if (bottomSheetRef.current) {
      setPage(page)
      bottomSheetRef.current.expand();
    }
  };


  return (
    <GestureHandlerRootView>
    
      <View style={styles.container}>
  
      
        <View style={styles.containerImage}>
          <Image
            source={require("@/assets/images/initial.png")}
            style={styles.image}
          />
        </View>

        <View style={styles.contentText}>
          <Text style={styles.title}>Bem-vindo ao Agende Mais!</Text>
          <Text style={styles.subtitle}>
            Conecte-se ou crie sua conta para começar a explorar.
          </Text>
        </View>

        <View style={styles.containerButton}>
          <TouchableOpacity style={styles.button} activeOpacity={0.8}
          onPress={()=> handleOpenPress('login')}
          >
            <Text style={styles.textButton}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonOutline} activeOpacity={0.8}
          onPress={()=> handleOpenPress('register')}
          >
            <Text style={styles.textButtonOutline}>Se cadastrar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} index={-1}>
        <BottomSheetView>
          {
            page ==='login' ?
            <Login close={handleClosePress}/> :
            <Register close={handleClosePress}/>
          }
          
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    paddingHorizontal: 10,
  },
  contentText: {
    alignItems: "center",
    paddingTop: 10,
  },
  title: {
    color: colors.dark,
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    textAlign: "center",
  },
  subtitle: {
    color: colors.gray,
    fontFamily: "Poppins-Medium",
    textAlign: "center",
  },
  image: {
    width: 460,
    height: 460,
    objectFit: "contain",
  },
  containerImage: {
    alignItems: "center",
  },
  containerButton: {
    alignItems: "center",
    gap: 4,
    paddingTop: 10,
  },
  button: {
    backgroundColor: colors.primary,
    width: width * 0.9,
    alignItems: "center",
    borderRadius: 6,
    paddingVertical: 14,
  },
  textButton: {
    color: "white",
    fontFamily: "Poppins-Regular",
  },
  buttonOutline: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: colors.primary,
    width: width * 0.9,
    alignItems: "center",
    borderRadius: 6,
    paddingVertical: 14,
  },
  textButtonOutline: {
    color: colors.primary,
    fontFamily: "Poppins-Regular",
  },
});

export default InitialHome;
