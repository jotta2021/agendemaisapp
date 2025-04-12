import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import SearchBar from "@/app/_components/SearchBar";
import api from "@/app/hooks/apiService";
import { context } from "@/app/_contexts";
import { Toast } from "react-native-toast-notifications";
import { router, useFocusEffect } from "expo-router";
import LoadingComponent from "@/app/_components/LoadingComponent";
import { Feather, Ionicons } from "@expo/vector-icons";
import colors from "@/assets/colors";
import { FAB } from "@rneui/themed";
// import { Container } from './styles';
type Professional = {
  id: string;
  name: string;
  email: string;
  status: boolean;
  description: string;
  phone: string;
  schedules: [];
  services: [];
};

const Profissionals = () => {
  const [search, setSearch] = useState("");
  const [profissionals, setProfissionals] = useState<Professional[]>([]);
  const [filteredList,setFilteredList]= useState<Professional[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(context);
  async function getProfissionals() {
    setLoading(true);
    await api
      .get(`/professionalByEnterprise?id_enterprise=${user?.id}`)
      .then((res) => {
        setLoading(false);
        setProfissionals(res.data);
        setFilteredList(res.data)
      })
      .catch((error) => {
        setLoading(false);
        Toast.show("Ocorreu um erro ao buscar os profissionais");
      });
  }

  useFocusEffect(
    useCallback(() => {
      getProfissionals();
    }, [])
  );

  function SearchProfissionals() {
      if (search !== "") {
        setLoading(true);
        const searched = profissionals.filter((item) =>
          item.name.toUpperCase().includes(search.toUpperCase())
        );
        if (searched.length === 0) {
          setFilteredList([]);
          setLoading(false);
        }
        setLoading(false);
        setFilteredList(searched);
      } else {
        setFilteredList(profissionals);
      }
    }
    //sempre que digitar algo, e feito uma busca nos servicos
    useEffect(() => {
      SearchProfissionals();
    }, [search]);
const height = Dimensions.get('screen').height
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <SearchBar value={search} setValue={setSearch} />

        <View style={styles.content}>
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
            <FlatList
              data={filteredList}
              keyExtractor={(item, index) => item.id.toString()}
              contentContainerStyle={{ gap: 10 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.profissional}
                  onPress={() =>
                    router.push(
                      `/settingsPages/profissionals/${item.id}` as never
                    )
                  }
                >
                  <Feather name="user" color={colors.primary} size={24} />
                  <View>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
      <FAB
        icon={<Ionicons name="add" size={20} color={"white"} />}
        color={colors.primary}
        placement={"right"}
        onPress={() => router.push("/settingsPages/profissionals/[id]")}
        style={{bottom:height*0.08}}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    marginStart: 10,
    marginEnd: 10,
    flex: 1,
  
  },
  content: {
    marginTop: 10,
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
  title: {
    fontFamily: "Poppins-Medium",
  },
  description: {
    color: "grey",
  },
});

export default Profissionals;
