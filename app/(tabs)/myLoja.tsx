import colors from "@/assets/colors";
import React, { useContext, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { context } from "../_contexts";
import api from "../hooks/apiService";
import { Toast } from "react-native-toast-notifications";

interface enterprise {
  name_enterprise: string;
  description: string;
  email: string;
  cnpj_cpf: string;
  district: string;
  city: string;
  adress: string;
  number: string;
  name_user: string;
  color_header: string;
  img_profile: string;
  banner: string;
  cep: string;
  id: string;
}
const height = Dimensions.get("screen").height;
const MyLoja: React.FC = () => {
  const { user, setUser } = useContext(context);
  const [data, setData] = useState<enterprise>({
    name_enterprise: "",
    description: "",
    email: "",
    cnpj_cpf: "",
    district: "",
    city: "",
    adress: "",
    number: "",
    name_user: "",
    color_header: "#fff",
    img_profile: "",
    banner: "",
    cep: "",
    id: "",
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categorySelected, setCategorySelected] = useState<string>("");
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
  async function getCategories() {
    setLoading(true);
    await api
      .get(`/categorieServiceAll?id_enterprise=${user && user.id}`)
      .then((res) => {
        const data = res.data;
        setLoading(false);
        setCategories(data);
      })
      .catch((error) => {
        setLoading(false);
        Toast.show("Erro ao buscar categorias", { type: "danger" });
      });
  }

  useEffect(() => {
    getData();
    getCategories();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.containerProfile}></View>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{data.name_enterprise}</Text>
        <Text style={styles.subtitle}>{data.description}</Text>

        <View style={styles.dataContent}>
          <Text style={styles.titleServices}>Serviços</Text>
          
            <FlatList
              data={categories}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{
                gap: 10,
                paddingStart: 10,
                paddingTop: 10,
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.categoryContainer,
                    {
                      backgroundColor:
                        categorySelected === item.id
                          ? colors.primary
                          : colors["primary-light"],
                    },
                  ]}
                  onPress={() => {
                    setCategorySelected(item.id);
                  }}
                >
                  <Text
                    style={[
                      styles.category,
                      {
                        color: categorySelected === item.id ? "white" : "black",
                      },
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: colors["primary-light"],
    height: height * 0.3,
    alignItems: "center",
  },
  containerProfile: {
    width: 150,
    height: 150,
    backgroundColor: "white",
    borderRadius: 150,
    marginTop: 60,
    elevation: 5,
  },
  content: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  title: {
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    fontSize: 18,
    color: colors.gray,
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    color: colors.gray,
  },
  dataContent: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: 16,
  },
  titleServices: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: colors.primary,
  },
  categoryContainer: {
    padding: 4,
    borderRadius: 10,
    alignItems: "center",
  },
  category: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
  },
  buttonRemove: {
    backgroundColor: colors["gray-medium"],
    marginTop: 20,
    padding: 10,
    borderRadius: 20,
    width: 200,
    alignItems: "center",
  },
});

export default MyLoja;
