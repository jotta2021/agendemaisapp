import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import InputComponent from "./InputComponent";
import colors from "@/assets/colors";
import Close from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/Feather";
import { CheckBox } from "@rneui/themed";
import { Toast, useToast } from "react-native-toast-notifications";
import { useRouter } from "expo-router";
import api from "../hooks/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { context } from "../_contexts";

const width = Dimensions.get("screen").width;

interface Props {
  close: () => void;
}
const Login = ({ close }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remenber, setRemenber] = useState(false);
  const [securityPassword, setSecurityPassword] = useState(true);
  const { user, setUser } = useContext(context) || {};
  const [loading, setLoading] = useState(false);
  const [recoveryPassword, setRecoveryPassword] = useState(false);
  const router = useRouter();
  const toast = useToast();
  async function testStorage() {
    try {
      await AsyncStorage.setItem("testKey", "Hello World");
      const value = await AsyncStorage.getItem("testKey");
      console.log("Valor armazenado:", value);
    } catch (error) {
      console.log("Erro ao testar AsyncStorage:", error);
    }
  }

  async function handleLogin() {
    if (email !== "" && password !== "") {
      setLoading(true);
      await api
        .post("/loginEnterprise", {
          email: email,
          password: password,
        })
        .then(async (res) => {
          const data = res.data;
          setUser(data);
          const user = {
            id: data.id,
            name_enterprise: data.name_enterprise,
            remenber: remenber,
          };
          console.log(data);
          try {
            await AsyncStorage.setItem("token", data.token);

            await AsyncStorage.setItem("user", JSON.stringify(user));
          } catch (error) {
            console.log("Erro ao salvar no storage", error);
          }

          setLoading(false);
          router.push("/(tabs)");
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
          Toast.show(`${error?.response?.data}`, { type: "danger" });
        });
    } else {
      toast.show("Preencha os campos vazios");
    }
  }
  async function RecoveryPassword() {
    if (email !== "") {
      setLoading(true);
      await api
        .post("/recoverPassword", { email: email })

        .then((res) => {
          setLoading(false);
          Toast.show("Te enviamos um email com uma nova senha.", {
            type: "success",
          });
          setEmail("");
          router.push("/initial");
        })
        .catch((error) => {
          setLoading(false);
          Toast.show("Houve um erro ao recuperar sua senha", {
            type: "danger",
          });
        });
    } else {
      Toast.show("Informe o seu email");
    }
  }
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {recoveryPassword ? "Recuperação de senha" : "Login"}
          </Text>
          <TouchableOpacity onPress={close}>
            <Close name="x" size={24} color={colors.dark} />
          </TouchableOpacity>
        </View>
        {recoveryPassword ? (
          <View style={styles.form}>
            <Text style={{ color: colors.gray }}>
              Você receberá um email com uma nova senha temporária
            </Text>
            <InputComponent
              label="Email"
              placeholder="Informe seu email"
              value={email}
              setValue={setEmail}
              type="default"
              security={false}
              icon=""
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setRecoveryPassword(false)}
            >
              <Text style={{ color: colors.primary }}>Voltar para login</Text>
            </TouchableOpacity>
            <View style={styles.containerButton}>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={RecoveryPassword}
              >
                <Text style={styles.textButton}>
                  {loading ? (
                    <ActivityIndicator color={"white"} />
                  ) : (
                    "Confirmar"
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.form}>
            <InputComponent
              label="Email"
              placeholder="Informe seu email"
              value={email}
              setValue={setEmail}
              type="default"
              security={false}
              icon=""
            />
            <InputComponent
              label="Senha"
              placeholder="Informe sua senha"
              icon={
                !securityPassword ? (
                  <Icon name="eye" size={20} color={colors.gray} />
                ) : (
                  <Icon name="eye-off" size={20} color={colors.gray} />
                )
              }
              type="default"
              security={securityPassword}
              value={password}
              setValue={setPassword}
              visible={securityPassword}
              setVisible={setSecurityPassword}
            />

            <CheckBox
              title={"Lembrar de mim"}
              checkedColor={colors.primary}
              checked={remenber}
              onPress={() => setRemenber(!remenber)}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setRecoveryPassword(true)}
            >
              <Text style={{ color: colors.primary }}>Esqueci minha senha</Text>
            </TouchableOpacity>
            <View style={styles.containerButton}>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={handleLogin}
              >
                <Text style={styles.textButton}>
                  {loading ? <ActivityIndicator color={"white"} /> : "Entrar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
  },
  form: {
    gap: 10,
    paddingTop: 20,
  },
  button: {
    backgroundColor: colors.primary,
    width: width * 0.9,
    alignItems: "center",
    borderRadius: 6,
    paddingVertical: 14,
  },
  containerButton: {
    alignItems: "center",
    marginTop: 20,
  },
  textButton: {
    color: "white",
    fontFamily: "Poppins-Regular",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
export default Login;
