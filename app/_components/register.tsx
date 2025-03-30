import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import InputComponent from "./InputComponent";
import colors from "@/assets/colors";
import Close from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/Feather";
import { CheckBox } from "@rneui/themed";
import StepIndicator from "react-native-step-indicator";
import { Toast } from "react-native-toast-notifications";
import MaskInput, { Masks } from "react-native-mask-input";
import InputMasKComponent from "./InputMaskComponent";
import api from "../hooks/apiService";
import { ActivityIndicator } from "react-native";
import removeNonNumeric from "../hooks/removeNonNumeric";
const width = Dimensions.get("screen").width;

interface Props {
  close: () => void;
}
const Register = ({ close }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [nameEnterprise, setNameEnterprise] = useState("");
  const [description, setDescription] = useState("");
  const [securityPassword, setSecurityPassword] = useState(true);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [loading, setLoading] = useState(false);
  const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: colors.primary,
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: colors.primary,
    stepStrokeUnFinishedColor: "#aaaaaa",
    separatorFinishedColor: colors.primary,
    separatorUnFinishedColor: "#aaaaaa",
    stepIndicatorFinishedColor: colors.primary,
    stepIndicatorUnFinishedColor: "#ffffff",
    stepIndicatorCurrentColor: "#ffffff",
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: colors.primary,
    stepIndicatorLabelFinishedColor: "#ffffff",
    stepIndicatorLabelUnFinishedColor: "#aaaaaa",
    labelColor: "#999999",
    labelSize: 13,
    currentStepLabelColor: colors.primary,
  };

  // email, password,name_enterprise,description,cnpj_cpf,phone,name_user

  async function Register() {
    if (
      email !== "" &&
      password !== "" &&
      nameEnterprise !== "" &&
      description !== "" &&
      cpf !== "" &&
      phone !== "" &&
      name !== ""
    ) {
      setLoading(true);
      const data = {
        email: email,
        password: password,
        name_enterprise: nameEnterprise,
        description: description,
        cnpj_cpf: removeNonNumeric(cpf) ,
        phone: removeNonNumeric(phone) ,
        name_user: name,
      };
      await api
        .post("/registerEnterprise", data)
        .then((res) => {
          setLoading(false);
          setEmail('')
          setPassword('')
          setNameEnterprise('')
          setDescription('')
          setCpf('')
          setPhone('')
          setName('')
          close()
          Toast.show("Uhu! Seu cadastro foi realizado", { type: "success" });
        })
        .catch((error) => {
          setLoading(false);
          Toast.show("Eita, ocorreu um erro ao realizar cadastro", {
            type: "danger",
          });
          console.log("Eita, ocorreu um erro ao realizar cadastro", error);
        });
    } else {
      Toast.show("Preencha todos os campos");
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Cadastre-se</Text>

          <TouchableOpacity onPress={close}>
            <Close name="x" size={24} color={colors.dark} />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Crie sua conta em poucos passos</Text>
        <View style={styles.step}>
          <StepIndicator
            customStyles={customStyles}
            currentPosition={currentPosition}
            stepCount={3}
          />
        </View>

        <View style={styles.form}>
          {currentPosition === 0 ? (
            <View style={styles.formContent}>
              <InputComponent
                label="Nome Completo"
                placeholder="Informe seu nome"
                value={name}
                setValue={setName}
                type="default"
                security={false}
                icon=""
              />
              <InputMasKComponent
                label="CPF ou CNPJ"
                placeholder="Informe seu CPF ou CNPJ"
                value={cpf}
                setValue={setCpf}
                type="default"
                security={false}
                icon=""
                maskType="cpf"
              />
              <InputMasKComponent
                label="Telefone"
                placeholder="Informe seu telefone"
                value={phone}
                setValue={setPhone}
                type="numeric"
                security={false}
                icon=""
                maskType="phone"
              />
            </View>
          ) : currentPosition === 1 ? (
            <View style={styles.formContent}>
              <InputComponent
                label="Nome da empresa"
                placeholder="Informe o nome da empresa"
                value={nameEnterprise}
                setValue={setNameEnterprise}
                type="default"
                security={false}
                icon=""
              />
              <InputComponent
                label="Descrição da empresa"
                placeholder="Descreva sua empresa em poucas palavras"
                value={description}
                setValue={setDescription}
                type="default"
                security={false}
                icon=""
              />
            </View>
          ) : currentPosition === 2 ? (
            <View style={styles.formContent}>
              <InputComponent
                label="Email"
                placeholder="Informe o seu email"
                value={email}
                setValue={setEmail}
                type="email-address"
                security={false}
                icon=""
              />
              <InputComponent
                label="Senha"
                placeholder="Crie uma  senha"
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
              <InputComponent
                label="Confirmação de senha"
                placeholder="Confirme sua senha"
                icon={""}
                type="default"
                security={true}
                value={confirmPassword}
                setValue={setConfirmPassword}
                visible={securityPassword}
                setVisible={setSecurityPassword}
              />
            </View>
          ) : null}

          <View style={styles.containerButton}>
            {currentPosition === 2 ? (
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={Register}
                disabled={loading}
              >
                <Text style={styles.textButton}>
                  {loading ? <ActivityIndicator color={'#fff'}/> : "Cadastrar"}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={() => setCurrentPosition(currentPosition + 1)}
              >
                <Text style={styles.textButton}>Próximo</Text>
              </TouchableOpacity>
            )}

            {currentPosition !== 0 && (
              <TouchableOpacity
                style={styles.buttonOutline}
                activeOpacity={0.8}
                onPress={() =>
                  currentPosition !== 0 &&
                  setCurrentPosition(currentPosition - 1)
                }
              >
                <Text style={styles.textButtonOutline}>Voltar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

{
  /** <InputComponent
                label="Senha"
                placeholder="Informe sua senha"
                icon={<Icon name="eye" size={20} color={colors.gray} />}
                type="password"
                value={password}
                setValue={setPassword}
              /> */
}
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
    paddingTop: 20,
  },
  formContent: {
    gap: 10,
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
    gap: 10,
  },
  textButton: {
    color: "white",
    fontFamily: "Poppins-Regular",
  },
  buttonOutline: {
    backgroundColor: "white",
    width: width * 0.9,
    alignItems: "center",
    borderRadius: 6,
    borderColor: colors.primary,
    borderWidth: 1,
    paddingVertical: 14,
  },
  textButtonOutline: {
    color: colors.primary,
    fontFamily: "Poppins-Regular",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  subtitle: {
    color: colors.gray,
    fontFamily: "Poppins-Regular",
  },
  step: {
    marginTop: 10,
  },
});
export default Register;
