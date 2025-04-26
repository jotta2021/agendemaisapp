import colors from "@/assets/colors";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";


interface Props {
    setOpen: (value:boolean) => void;
}
const CardDownloadApp = ({setOpen}:Props) => {
  return (
    <View style={styles.card}>
      <View style={{ alignItems: "center", flexDirection: "row",gap:10  }}>
        <TouchableOpacity onPress={() => setOpen(false)}>
          <AntDesign name="close" size={24} color={colors.primary} />
        </TouchableOpacity>

        <Image
          source={require("@/assets/images/icon.png")}
          alt="Baixe o aplicativo"
          style={{ width: 40, height: 40 }}
        />

        <View style={{ alignItems: "flex-start" }}>
          <Text style={styles.title}>Obtenha nosso aplicativo</Text>
          <Text style={styles.subtitle}>e tenha uma experiência completa</Text>
        </View>
      </View>
<View style={{justifyContent:'center'}}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.textButton}>Abrir</Text>
      </TouchableOpacity>
</View>
    
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors["primary-light"],
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-around",
    padding: 10,
    height:80
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: colors.primary,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: colors.primary,
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth:60,
    maxHeight:30
  },
  textButton: {
    fontWeight: "bold",
    color: "white",
  },
});
export default CardDownloadApp;
