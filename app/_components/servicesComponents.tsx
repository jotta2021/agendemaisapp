import colors from "@/assets/colors";
import { parse } from "date-fns";
import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import formatCurrencyToNumber from "../hooks/formatCurrencytoNumber";

// import { Container } from './styles';
interface Props {
  data: {
    id: string;
    name: string;
    description: string;
    duration: string;
    id_category: string;
    id_enterprise: string;
    status: boolean;
    image: string;
    time: string;
    value: number;
  };
}
const ServicesComponents = ({ data }: Props) => {
  console.log("data", data);

  function formatHour(timeString: string) {
    if (!timeString) return "";

    const time = parse(timeString, "HH:mm:ss", new Date());
    const hours = time.getHours();
    const minutes = time.getMinutes();

    if (hours > 0 && minutes > 0) {
      return `${hours}h${minutes}min`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}min`;
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <Image source={{ uri: data.image }} style={styles.image} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>
          {data.name} {formatHour(data.time)}
        </Text>
        <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
          {data.description}
        </Text>
        <Text style={styles.value}>
          {Number(data.value).toLocaleString("pt-BR", {
            currency: "BRL",
            style: "currency",
          })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.light,
    borderRadius: 6,
    padding:6,
    width:200
  },
  containerImage: {
    width: "100%",
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    objectFit:'cover'
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    gap:4,
    padding:10
  },
  description: {
    color: colors.gray,
    fontSize: 10,
    fontFamily: "Poppins-Regular",
  },
  title:{
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    textAlign:'center'
  },
  value:{
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: colors.primary,
    textAlign: "center",
  }
});

export default ServicesComponents;
