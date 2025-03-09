import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from "react-native";
import ButtonComponent from "../_components/buttonComponent";
import { FAB, Switch } from "@rneui/themed";
import colors from "@/assets/colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import SearchBar from "../_components/SearchBar";
import { router } from "expo-router";
import api from "../hooks/apiService";
import { context } from "../_contexts";
import { Toast } from "react-native-toast-notifications";
import { parse, format } from "date-fns";
import LoadingComponent from "../_components/LoadingComponent";
import { Image } from "react-native";

type Service = {
  id: string;
  value: number;
  description: string;
  name: string;
  status: boolean;
  time: string;
  image: string;
};
type Category = {
  id: string;
  name: string;
};
const Services = () => {
  const { user } = useContext(context);
  const [services, setServices] = useState<Service[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [categorySelected, setCategorySelected] = useState<string>("");
  const [loading, setLoading] = useState(false);
  async function getServices() {
    setLoading(true);
    await api
      .get(`/servicesByEnterprise?id_enterprise=${user?.id}`)
      .then((res) => {
        setServices(res.data);
        setLoading(false);
      })
      .catch((error) => {
        Toast.show(`Erro ao buscar os serviços ${error?.response?.data}`);
        setLoading(false);
      });
  }
  async function getCategories() {
    await api
      .get(`/categorieServiceAll?id_enterprise=${user && user.id}`)
      .then((res) => {
        const data = res.data;

        setCategoriesList(data);
      })
      .catch((error) => {
        Toast.show("Erro ao buscar categorias", { type: "danger" });
      });
  }

  useEffect(() => {
    getServices();
    getCategories();
  }, []);


  async function getProductsByCategory(){
    
  }

  function formatHour(timeString: string) {
    if (timeString) {
      const time = parse(timeString, "HH:mm:ss", new Date());
      const minutes = time.getMinutes();
      return `${minutes}min`;
    } else {
      return "";
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <SearchBar />

        {loading ? (
          <View
            style={{
              height: "90%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LoadingComponent />
          </View>
        ) : (
          <View>
            <FlatList
              data={categoriesList}
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
                  onPress={() => setCategorySelected(item.id)}
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
            <FlatList
              data={services}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.containerServices}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.service}>
                  <View style={styles.image}>
                    <Image src={item.image} style={styles.image} />
                  </View>
                  <View>
                    <Text style={styles.titleService}>{item.name}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                    <Text style={styles.time}>{formatHour(item.time)}</Text>
                    <View style={styles.containerValue}>
                      <View
                        style={
                          item.status === true
                            ? styles.status
                            : styles.statusInactive
                        }
                      >
                        <Text
                          style={{
                            color:
                              item.status === true
                                ? "#26ad2d"
                                : "rgba(156,40,58,255)",
                            fontFamily: "Poppins-Medium",
                          }}
                        >
                          {item.status === true ? "Ativo" : "Inativo"}
                        </Text>
                      </View>

                      <View style={styles.value}>
                        <Text style={{ color: "white" }}>
                          {Number(item.value).toLocaleString("pt-BR", {
                            currency: "BRL",
                            style: "currency",
                          })}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={getServices} />
              }
            />
          </View>
        )}
      </View>
      <FAB
        icon={<Ionicons name="add" size={20} color={"white"} />}
        color={colors.primary}
        placement={"right"}
        onPress={() => router.push("/addService/service")}
      />
    </SafeAreaView>
  );
};
const width = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    marginStart: 10,
    marginEnd: 10,
  },
  content: {
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  title: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
  },
  containerServices: {
    gap: 10,
    marginTop: 20,
  },
  service: {
    backgroundColor: "#e6e6e6",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  image: {
    backgroundColor: "#d1d1d1",
    width: 80,
    height: 80,
    borderRadius: 80,
  },
  titleService: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  description: {
    fontFamily: "Poppins-Regular",
    color: "grey",
    flexWrap: "wrap",
    width: width * 0.6,
  },
  time: {
    fontFamily: "Poppins-Regular",
  },
  status: {
    backgroundColor: "rgba(40,156,58,0.2)",
    borderRadius: 10,
    alignItems: "center",
    width: 80,
  },
  statusInactive: {
    backgroundColor: "rgba(156,40,58,0.2)",
    borderRadius: 10,
    alignItems: "center",
    width: 80,
  },
  containerValue: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  value: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 4,
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
});
export default Services;
