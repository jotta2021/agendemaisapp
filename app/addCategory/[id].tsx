import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import InputComponent from "../_components/InputComponent";
import InputMasKComponent from "../_components/InputMaskComponent";
import { Dropdown } from "react-native-element-dropdown";
import ButtonComponent from "../_components/buttonComponent";
import colors from "@/assets/colors";
import { context } from "../_contexts";
import api from "../hooks/apiService";
import { Toast } from "react-native-toast-notifications";
import { router, useNavigation } from "expo-router";
import { useLocalSearchParams, useSearchParams } from "expo-router/build/hooks";
import { CheckBox, Switch } from "@rneui/themed";
import LoadingComponent from "../_components/LoadingComponent";

const addCategory = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  console.log("id", id);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(context);

  async function getCategorie() {
    setLoading(true)
    await api
      .get(`/categorieById?id_categorie=${id}`)
      .then((res) => {
        setCategory(res.data.name);
        setStatus(res.data.status);
        setLoading(false)
      })

      .catch((error) => {
        Toast.show(`Erro ao buscar categoria ${error}`, { type: "danger" });
     setLoading(false)
      });
  }

  useEffect(() => {
    navigation.setOptions({
      title: id !== "[id]" ? "Atualizar Categoria" : "Adicionar Categoria",
    });
    getCategorie();
  }, [id]);

  async function CreateCategory(){
    if(category!==''){
        setLoading(true)
    const data = {
      name:category,
      id_enterprise:user && user.id
    }
    await api.post('/categorieService', data)
    .then((res)=> {
      setLoading(false)
      Toast.show("Categoria adicionada", {type:'success'})
      router.back()
      setCategory('')
    })
    .catch((error)=> {
      setLoading(false)
      Toast.show(`Erro ao adicionar categoria ${error?.response?.data}`, {type:'danger'})
    })
    }else{
      Toast.show("Informe o nome da categoria")
    }
  
  }

  async function UpdateCategorie() {
    if (category !== "") {
      setLoading(true);
      const data = {
        name: category,
       id:id,
       status:status
      };
      await api
        .put("/categorieService/update", data)
        .then((res) => {
          setLoading(false);
          Toast.show("Categoria atualizada", { type: "success" });
          router.back();
          setCategory("");
        })
        .catch((error) => {
          setLoading(false);
          Toast.show(`Erro ao atualizar categoria ${error?.response?.data}`, {
            type: "danger",
          });
        });
    } else {
      Toast.show("Informe o nome da categoria");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {
        loading ?
        <View style={{alignItems:'center',justifyContent:'center',flex:1}}>
           <LoadingComponent/> 
        </View>
       :

        <View style={styles.content}>
        <View style={styles.categoryContainer}>
          <InputComponent
            label="Nome"
            placeholder="Informe o nome da categoria"
            value={category}
            setValue={setCategory}
          />
          {id !== "[id]" && (
            <View style={styles.containerSwitch}>
              <Text>Ativo</Text>
              <Switch
                value={status}
                onValueChange={setStatus}
                trackColor={{ false: "#767577", true: colors.primary }}
       
              />
            </View>
          )}
        </View>

        <ButtonComponent
          title="Salvar"
          onPress={()=> {

            if(id === "[id]"){
              CreateCategory()
            }else{
              UpdateCategorie()
            }
            }}
          loading={loading}
        />
      </View>
      }
     
    </SafeAreaView>
  );
};
const height = Dimensions.get("screen").height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 10,
    marginStart: 10,
    marginEnd: 10,
    flex: 1,
    height: height,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingBottom: 80,
  },
  categoryContainer: {
    alignItems: "flex-start",
    gap:6
  },
  containerSwitch: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
  },
});
export default addCategory;
