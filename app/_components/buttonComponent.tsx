import colors from "@/assets/colors";
import { Button } from "@rneui/themed";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

// import { Container } from './styles';
interface Props {
  title: string;
  onPress: () => void;
  loading: boolean;
}
const ButtonComponent: React.FC<Props> = ({ title, onPress, loading }) => {
  return (
    <Button
      color={colors.primary}
      buttonStyle={styles.buttonStyle}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? <ActivityIndicator color={"white"} /> : title}
    </Button>
  );
};
const styles = StyleSheet.create({
  buttonStyle: {
    borderRadius: 8,
    paddingVertical: 10,
  },
});
export default ButtonComponent;
