import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  ScrollView,
} from "react-native";
import ButtonComponent from "../_components/buttonComponent";
import { FAB, Switch } from "@rneui/themed";
import colors from "@/assets/colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import SearchBar from "../_components/SearchBar";
import { router, useFocusEffect } from "expo-router";
import api from "../hooks/apiService";
import { context } from "../_contexts";
import { Toast } from "react-native-toast-notifications";
import { parse, format } from "date-fns";
import LoadingComponent from "../_components/LoadingComponent";
import { Image } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

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
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [categorySelected, setCategorySelected] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["40%"], []);
  async function getServices() {
    setLoading(true);
    await api
      .get(`/servicesByEnterprise?id_enterprise=${user?.id}`)
      .then((res) => {
        setServices(res.data);
        setFilteredServices(res.data);
        setLoading(false);
      })
      .catch((error) => {
        Toast.show(`Erro ao buscar os serviços ${error?.response?.data}`);
        setLoading(false);
      });
  }
  async function getServicesByCategory() {
    setLoading(true);
    await api
      .get(`/servicesByCategory?id_category=${categorySelected}`)
      .then((res) => {
        setServices(res.data);
        setFilteredServices(res.data);
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

  useFocusEffect(
    useCallback(() => {
      getServices();
      getCategories();
    },[])
  );

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

  const handleClosePress = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  };
  const handleOpenPress = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.expand();
    }
  };

  function SearchServices() {
    if (search !== "") {
      setLoading(true);
      const searched = services.filter((item) =>
        item.name.toUpperCase().includes(search.toUpperCase())
      );
      if (searched.length === 0) {
        setFilteredServices([]);
        setLoading(false);
      }
      setLoading(false);
      setFilteredServices(searched);
    } else {
      setFilteredServices(services);
    }
  }
  //sempre que digitar algo, e feito uma busca nos servicos
  useEffect(() => {
    SearchServices();
  }, [search]);

  //busca os servicos pela categoria
  useEffect(() => {
    if (categorySelected !== "") {
      getServicesByCategory();
    }
  }, [categorySelected]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <SearchBar
          value={search}
          setValue={setSearch}
          openFilter={handleOpenPress}
          filter={true}
        />

        {loading && (
          <View
            style={{
              height: "90%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LoadingComponent />
          </View>
        )}

        {!loading && (
          <FlatList
            data={filteredServices}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.containerServices}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.service}
                onPress={() => router.push(`/addService/${item.id}` as never)}
              >
                <View style={styles.image}>
                  <Image
                    source={{ uri: item.image }}
                    style={[styles.image, { objectFit: "contain" }]}
                  />
                </View>
                <View>
                  <Text style={styles.titleService}>{item.name}</Text>
                  <Text
                    style={styles.description}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.description}
                  </Text>
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
        )}

        {
          !loading && filteredServices.length === 0 && (
            <View style={{ height:'90%', alignItems: "center", justifyContent: "center" }}>
              <Text>
                Nenhum serviço encontrado 
              </Text>
            </View>
          )
        }
      </View>
      <BottomSheet snapPoints={snapPoints} index={-1} ref={bottomSheetRef}>
        <BottomSheetView>
          <View style={{ paddingHorizontal: 10 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                paddingHorizontal: 10,
              }}
            >
              <Text style={styles.title}>Listar serviços por categoria</Text>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.light,
                  borderRadius: 30,
                  width: 30,
                  height: 30,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={handleClosePress}
              >
                <Feather name="x" size={24} />
              </TouchableOpacity>
            </View>

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
                  onPress={() => {
                    setCategorySelected(item.id);
                    handleClosePress();
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
            {categorySelected !== "" && (
              <View style={{ alignItems: "center" }}>
                <TouchableOpacity
                  style={styles.buttonRemove}
                  onPress={() => {
                    setCategorySelected("");
                    getServices();
                    handleClosePress();
                  }}
                >
                  <Text>Desmarcar categoria</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </BottomSheetView>
      </BottomSheet>

      <FAB
        icon={<Ionicons name="add" size={20} color={"white"} />}
        color={colors.primary}
        placement={"right"}
        onPress={() => router.push("/addService/[id]")}
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
    flex: 1,
  },
  title: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
  },
  containerServices: {
    gap: 10,
  },
  service: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    elevation: 1,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    backgroundColor: "#d1d1d1",
    width: 80,
    height: 80,
    borderRadius: 80,
  },
  titleService: {
    fontSize: 15,
    fontFamily: "Poppins-Medium",
  },
  description: {
    fontFamily: "Poppins-Regular",
    color: "grey",
    flexWrap: "wrap",
    width: width * 0.6,
    fontSize: 12,
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
    width: 80,
    alignItems: "center",
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
export default Services;
