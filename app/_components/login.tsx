import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import InputComponent from "./InputComponent";
import colors from "@/assets/colors";
import Close from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/Feather";
// import { Container } from './styles';
const width = Dimensions.get("screen").width;

interface Props {
  close: () => void;
}
const Login = ({ close }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Login</Text>
        <TouchableOpacity onPress={close}>
          <Close name="x" size={24} color={colors.dark} />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <InputComponent
          label="Email"
          placeholder="Informe seu email"
          value={email}
          setValue={setEmail}
          type="text"
          icon=''
        />
        <InputComponent
          label="Senha"
          placeholder="Informe sua senha"
          icon={<Icon name="eye" size={20} color={colors.gray} />}
          type="password"
          value={password}
          setValue={setPassword}
        />
        <View style={styles.containerButton}>
          <TouchableOpacity style={styles.button} activeOpacity={0.8}>
            <Text style={styles.textButton}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
