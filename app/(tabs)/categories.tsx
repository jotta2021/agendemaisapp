import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
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
import { FAB, Switch } from "@rneui/themed";
import colors from "@/assets/colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from 'react-native-vector-icons/Entypo'
import SearchBar from "../_components/SearchBar";
import { router, useFocusEffect } from "expo-router";
import api from "../hooks/apiService";
import { context } from "../_contexts";
import { Toast } from "react-native-toast-notifications";
import LoadingComponent from "../_components/LoadingComponent";


type Category = {
  id: string;
  name: string;
};
const Categories = () => {
  const { user } = useContext(context);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [filteredCategories,setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  async function getCategories() {
    setLoading(true)
    await api
      .get(`/categorieServiceAll?id_enterprise=${user && user.id}`)
      .then((res) => {
        const data = res.data;
        setLoading(false)
        setCategoriesList(data);
        setFilteredCategories(data)
      })
      .catch((error) => {
        setLoading(false)
        Toast.show("Erro ao buscar categorias", { type: "danger" });
      });
  }
useFocusEffect(
  useCallback(()=> {
    getCategories()
  },[])
)
 

 function SearchCategories() {
    if (search !== "") {
      setLoading(true);
      const searched = categoriesList.filter((item) =>
        item.name.toUpperCase().includes(search.toUpperCase())
      );
      if (searched.length === 0) {
        setFilteredCategories([]);
        setLoading(false);
      }
      setLoading(false);
      setFilteredCategories(searched);
    } else {
      setFilteredCategories(categoriesList);
    }
  }
  //sempre que digitar algo, e feito uma busca nos servicos
  useEffect(() => {
    SearchCategories();
  }, [search]);


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <SearchBar
          value={search}
          setValue={setSearch}
          
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
            data={filteredCategories}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.containerServices}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.service} onPress={()=> router.push(`/addCategory/${item.id}` as never)}>
                <Text style={styles.titleService}>{item.name}</Text>
                <Entypo name="pencil" size={20} color={colors["primary-light"]}/>
              </TouchableOpacity>
            )}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={getCategories} />
            }
          />
        )}
      </View>
    
      {
              !loading && filteredCategories.length === 0 && (
                <View style={{ height:'90%', alignItems: "center", justifyContent: "center" }}>
                  <Text>
                    Nenhuma categoria encontrada
                  </Text>
                </View>
              )
            }

      <FAB
        icon={<Ionicons name="add" size={20} color={"white"} />}
        color={colors.primary}
        placement={"right"}
        onPress={() => router.push("/addCategory/[id]")}
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
  },
  service: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:'space-between',
    elevation:1,
    shadowColor:'black',
    shadowOffset:{width:0,height:1},
    shadowOpacity:0.1,
    shadowRadius:4
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
    fontSize:12,
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
  buttonRemove: {
    backgroundColor: colors["gray-medium"],
    marginTop: 20,
    padding: 10,
    borderRadius: 20,
    width: 200,
    alignItems: "center",
  },
});
export default Categories;
