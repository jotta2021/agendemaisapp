import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import api from "../hooks/apiService";
import { context } from "../_contexts";
import { Toast } from "react-native-toast-notifications";
import User from "react-native-vector-icons/FontAwesome";
import colors from "@/assets/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import RefreshIcon from "react-native-vector-icons/Feather";
const Profile: React.FC = () => {
  const { user, setUser } = useContext(context);
  const [data, setData] = useState<{
    name_user: string;
    img_profile: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  async function getData() {
    setLoading(true);
    await api
      .get(`/enterprise?id=${user && user.id}`)
      .then((res) => {
        setLoading(false);
        setData(res.data);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error?.response?.data);
        Toast.show(`${error}`, { type: "danger" });
      });
  }

  async function Logout() {
    setUser(null);
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
    Toast.show("Você foi desconectado");
    router.push("/initial");
  }

  useFocusEffect(
    useCallback(()=> {
      if (user) {
        getData();
      }
    },[user])
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          {data && data.img_profile ? (
            <Image
              style={styles.img_container}
              source={{ uri: data.img_profile }}
             
            />
          ) : (
            <User name="user-circle" color={"white"} size={50} />
          )}
          <Text style={styles.text}>{data?.name_user}</Text>
        </View>
      
        
      </View>
      <View style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.title}>MINHA CONTA</Text>

          <TouchableOpacity
            onPress={() => router.push("/settingsPages/mydata")}
          >
            <Text style={styles.option}>Meus Dados</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/settingsPages/mydata")}
          >
            <Text style={styles.option}>Meu plano</Text>
          </TouchableOpacity>
         

          <Text style={styles.title}>CONFIGURAÇÃO</Text>
          <TouchableOpacity
          onPress={() => router.push("/settingsPages/profissionals/profissionals")}
          >
            <Text style={styles.option}>Profissionais</Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={() => router.push("/settingsPages/security")}
          >
            <Text style={styles.option}>Segurança</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.option}>Privacidade</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.option}>Termos e Condições de Uso</Text>
          </TouchableOpacity>

          <Text style={styles.title}>GERAL</Text>

          <TouchableOpacity>
            <Text style={styles.option}>Ajuda</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.option}>Desativar Conta</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={Logout}>
            <Text style={styles.option}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  text: {
    fontFamily: "Poppins-Regular",
    color: "white",
  },
  form: {
    gap: 10,
    paddingTop: 20,
  },
  title: {
    color: "grey",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  option: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
  },
  img_container: {
    borderRadius: 50,
    width:50,
    height:50
  },
});
export default Profile;
