import React, { useContext, useState } from "react";
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
import { router } from "expo-router";



const addCategory = () => {
 
  const [category, setCategory] = useState("");
  const [loading,setLoading] = useState(false)
const {user} = useContext(context)


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


  return (
    <SafeAreaView style={styles.container} >
    
    
          <View style={styles.content}>
            <InputComponent
              label="Nome"
              placeholder="Informe o nome da categoria"
              value={category}
              setValue={setCategory}
            />
            
            
              <ButtonComponent title="Salvar" onPress={CreateCategory} loading={loading} />
           
            
          </View>
       
 
    </SafeAreaView>
  );
};
const height = Dimensions.get("screen").height
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 10,
    paddingBottom:20,
    marginStart:10,
    marginEnd:10,
    flex:1,
    height:height,
    flexDirection:'column',
    justifyContent:'space-between'
  },
 

});
export default addCategory;
