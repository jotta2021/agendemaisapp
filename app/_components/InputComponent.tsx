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

// import { Container } from './styles';
interface Props {
  label: string;
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  type: string;
icon:ReactNode
}

const InputComponent = ({
  label,
  placeholder,
  value,
  setValue,
  icon,
  type,
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
        <TextInput
          placeholder={placeholder}
          style={isFocus ? styles.inputFocus :styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          onChangeText={(text) => setValue(text)}
         secureTextEntry={type && type==='password'? true : false}
        />
        {icon && (
          <TouchableOpacity activeOpacity={0.8} style={styles.icon}>
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
  },
  containerInput: {},
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderWidth: 0.2,
    borderRadius: 10,
  
  },
  inputFocus:{
    backgroundColor: "#fff",
    padding: 14,
    borderWidth: 0.2,
    borderRadius: 10,
    borderColor:colors.primary
  },
  icon: {
    position: "absolute",
    right: 10,
    top: 10,
  },
});

export default InputComponent;