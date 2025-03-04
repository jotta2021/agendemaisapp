import colors from "@/assets/colors";
import React, { ReactNode, useState } from "react";
import { KeyboardTypeOptions } from "react-native";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import MaskInput,{Masks} from "react-native-mask-input";
// import { Container } from './styles';
interface Props {
  label: string;
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  type?: KeyboardTypeOptions;
  icon?: ReactNode;
  security?: boolean | undefined;
  visible?: boolean | undefined
  setVisible?:(value:boolean)=> void | undefined;
  maskType: string;
}

const InputMasKComponent = ({
  label,
  placeholder,
  value,
  setValue,
  icon,
  type,
  security,
  visible,
  setVisible,
  maskType
}: Props) => {
  const [isFocus, setIsFocus] = useState(false);
  
  function handleFocus() {
    setIsFocus(true); // Define o foco como verdadeiro quando o input for focado
  }

  function handleBlur() {
    setIsFocus(false); // Define o foco como falso quando o input perder o foco
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.containerInput}>
        <MaskInput
        mask={maskType ==='phone' ? Masks.BRL_PHONE : maskType ==='cpf' ? Masks.BRL_CPF : maskType==='cep' ? Masks.ZIP_CODE : Masks.BRL_CPF}
          placeholder={placeholder}
          style={isFocus ? styles.inputFocus : styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          onChangeText={(masked,unMasked) => setValue(masked)}
          keyboardType={type}
        />
        {icon && (
          <TouchableOpacity activeOpacity={0.8} style={styles.icon} onPress={()=> visible && setVisible && setVisible(!visible)}>
            {icon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  label: {
    fontFamily: "Poppins-Medium",
    fontSize:12
  },
  containerInput: {},
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderWidth: 0.2,
    borderRadius: 10,
  },
  inputFocus: {
    backgroundColor: "#fff",
    padding: 14,
    borderWidth: 0.2,
    borderRadius: 10,
    borderColor: colors.primary,
  },
  icon: {
    position: "absolute",
    right: 10,
    top: 10,
  },
});

export default InputMasKComponent;
