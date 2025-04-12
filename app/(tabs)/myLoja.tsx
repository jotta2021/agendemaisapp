import colors from "@/assets/colors";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Pressable,
} from "react-native";
import { context } from "../_contexts";
import api from "../hooks/apiService";
import { Toast } from "react-native-toast-notifications";
import { useFocusEffect } from "expo-router";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { Tab, TabView } from "@rneui/themed";
import { TabItem } from "@rneui/base/dist/Tab/Tab.Item";
import ServicesComponents from "../_components/servicesComponents";
import LoadingComponent from "../_components/LoadingComponent";
import { Feather } from "@expo/vector-icons";

type enterprise = {
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
  state: string;
};
type service = {
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
    state: "",
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<
    { id: string; name: string; status: boolean }[]
  >([]);
  const [categorySelected, setCategorySelected] = useState<string>("");
  const [services, setServices] = useState<service[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [profissionals, setProfissionals] = useState([]);
  //controla os tabs
  const [index, setIndex] = useState(0);

  console.log(data);
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
        const filtered = data.filter((item: any) => item.status === true);
        setCategories(filtered);
      })
      .catch((error) => {
        setLoading(false);
        Toast.show("Erro ao buscar categorias", { type: "danger" });
      });
  }

  async function getProfissionals() {
    setLoading(true);
    await api
      .get(`/professionalByEnterprise?id_enterprise=${user?.id}`)
      .then((res) => {
        setLoading(false);
        setProfissionals(res.data);
      })
      .catch((error) => {
        setLoading(false);
        Toast.show("Ocorreu um erro ao buscar os profissionais");
      });
  }

  useFocusEffect(
    useCallback(() => {
      getData();
      getCategories();
      getProfissionals();
    }, [])
  );

  // funcao para buscar os serviços de uma categoria
  async function getSevicesByCategory() {
    setLoadingServices(true);
    await api
      .get(`/servicesByCategory?id_category=${categorySelected}`)
      .then((res) => {
        const data = res.data;
        //vai filtrar apenas os serviços que estao ativos
        const filtered = data.filter((item: any) => item.status === true);
        setServices(filtered);
        setLoadingServices(false);
      })
      .catch((error) => {
        Toast.show(`Erro ao buscar serviços ${error?.response?.data}`, {
          type: "danger",
        });
        setLoadingServices(false);
      });
  }

  useEffect(() => {
    getSevicesByCategory();
  }, [categorySelected]);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <LoadingComponent />
        </View>
      ) : (
        <View>
          <View style={[styles.header, { backgroundColor: data.color_header }]}>
            <View style={styles.containerProfile}>
              <Image
                source={{ uri: data.img_profile }}
                style={{
                  borderRadius: 150,
                  objectFit: "contain",
                  width: 150,
                  height: 150,
                }}
              />
            </View>
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>{data.name_enterprise}</Text>
            <Text style={styles.subtitle}>{data.description}</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              <EvilIcons name="location" size={20} color={colors.primary} />
              <View>
                <Text style={styles.adress}>
                  {data.district} , {data.adress}, {data.number}
                </Text>
                <Text style={styles.adress}>
                  {data.city} {data.state} {data.cep && `- ${data.cep}`}{" "}
                </Text>
              </View>
            </View>

            <Tab
              style={{ marginTop: 20 }}
              value={index}
              onChange={setIndex}
              dense
              indicatorStyle={{ backgroundColor: colors.primary }}
            >
              <TabItem titleStyle={{ color: colors.dark, fontSize: 14 }}>
                Serviços
              </TabItem>
              <TabItem titleStyle={{ color: colors.dark, fontSize: 14 }}>
                Avaliações
              </TabItem>
              <TabItem titleStyle={{ color: colors.dark, fontSize: 14 }}>
                Detalhes
              </TabItem>
            </Tab>

            {index === 0 ? (
              <View style={styles.dataContent}>
                <FlatList
                  data={categories}
                  keyExtractor={(item) => item.id}
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
                              ? colors.gray
                              : colors.light,
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
                            color:
                              categorySelected === item.id ? "white" : "black",
                          },
                        ]}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                />

                {loadingServices ? (
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      paddingTop: 100,
                    }}
                  >
                    <LoadingComponent />
                  </View>
                ) : (
                  <FlatList
                    data={services}
                    contentContainerStyle={{
                      marginTop: 20,
                      paddingHorizontal: 10,
                      gap: 10,
                    }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <ServicesComponents data={item} />
                    )}
                  />
                )}
              </View>
            ) : index === 1 ? (
              <View></View>
            ) : (
              <View style={[styles.dataContent, { padding: 10 }]}>
                <Text style={{fontSize:16}}>Profissionais</Text>

                <FlatList
                  data={profissionals}
                  keyExtractor={(item, index) => item.id.toString()}
                  contentContainerStyle={{ gap: 10, marginTop: 10 }}
                  renderItem={({ item }) => (
                    <Pressable key={item.id} style={styles.profissional}>
                      <Feather name="user" color={colors.primary} size={24} />
                      <View>
                        <Text style={styles.titleServices}>{item.name}</Text>
                        <Text style={styles.descriptionProfissional}>
                          {item.description}
                        </Text>
                      </View>
                    </Pressable>
                  )}
                />
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: colors["primary-light"],
    height: height * 0.2,
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
    paddingTop: 60,
  },
  title: {
    fontFamily: "Poppins-Medium",
    textAlign: "center",
    fontSize: 18,
    color: colors.gray,
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    color: colors.gray,
    fontSize: 12,
  },
  dataContent: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: 16,
  },
  titleServices: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: colors.gray,
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
  adress: {
    fontSize: 10,
    color: colors.dark,
    fontFamily: "Poppins-Medium",
    textAlign: "center",
  },
  profissional: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 1,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  descriptionProfissional: {
    color: "grey",
    fontSize: 12,
  },
});

export default MyLoja;
