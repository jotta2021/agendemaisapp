import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { context } from "../_contexts";
import api from "../hooks/apiService";
import { Toast } from "react-native-toast-notifications";
import InputComponent from "../_components/InputComponent";
import colors from "@/assets/colors";
import ButtonComponent from "../_components/buttonComponent";
import ImageIcon from 'react-native-vector-icons/Ionicons'
import * as ImagePicker from 'expo-image-picker';
import { formToJSON } from "axios";
import InputMasKComponent from "../_components/InputMaskComponent";

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
  cep:string
  id:string
  phone:String
  state:string

}
const Security = () => {
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
    cep:'',
    id: '',
    phone:"",
    state:""
  });
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
const [password,setPassword] = useState('')
const [confirmPassword,setConfirmPassword] = useState('')
const [loadingButton,setLoadingButton] = useState(false)
  async function getData() {
    setLoading(true);
    await api
      .get(`/enterprise?id=${user && user.id}`)
      .then((res) => {
        const data = res.data;
        setLoading(false);
        setData(res.data);
        setEmail(data?.email);
      
       
      })
      .catch((error) => {
        setLoading(false);
        console.log(error?.response?.data);
        Toast.show(`${error}`, { type: "danger" });
      });
  }
  useEffect(() => {
    getData();
  }, []);


 


async function UpdateData() {
if( password!=='' && confirmPassword!=='' ){
  if( password===confirmPassword){
    const formdata = new FormData();
    setLoadingButton(true)
    const dataApi = {
      id: data.id,
      name_enterprise: data.name_enterprise,
      description:data. description,
      cnpj_cpf: data.cnpj_cpf,
      phone: data.banner,
      name_user: data.name_user,
      adress: data.adress,
      color_header: data.color_header,
      banner: data.banner,
      img_profile: data.img_profile,
      city: data.city,
      state: data.state,
      district: data.district,
      number: data.number,
      latitude: null,
      longitude: null,
      cep:data.cep,
      password:password
    };
    
    Object.entries(dataApi).forEach(([key, value]) => {
      if (
        value !== null &&
        value !== undefined 
      ) {
        formdata.append(key, value);
      }
    });
      try {
        const res = await api.put('/enterprise/update',formdata,{
          headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json",
          },
        });
        setLoadingButton(false)
        Toast.show("Senha atualizada", { type: 'success' });
        setConfirmPassword('')
        setPassword('')
      } catch (error: unknown) {
        setLoadingButton(false);
      
        if (error instanceof Error) {
          console.log('Erro da API:', (error as any).response?.data || error.message);
          Toast.show(`Erro ao atualizar senha: ${error.message}`, { type: 'danger' });
        } else {
          console.log('Erro desconhecido:', error);
          Toast.show('Ocorreu um erro inesperado.', { type: 'danger' });
        }
      }
      
  }else{
    Toast.show('As senhas precisam ser iguais')
  }
  
}else{
  Toast.show('Preencha os campos vazios')
}
 
}

  return (
    <KeyboardAvoidingView behavior="height">
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.card}>
              <Text style={styles.titleCard}>Sua loja</Text>

              <View style={styles.containerInputs}>
                
                  <Text style={styles.label}>Email</Text>
                      <View style={styles.containerInput}>
                        <TextInput
                          placeholder="Email"
                          style={styles.input}
                          value={email}
                          onChangeText={(text) => setEmail(text)}
                          editable={false}
                   
                        />
                      
                      </View>
             
                <InputComponent
                  label="Nova senha"
                  value={password}
                  setValue={setPassword}
                  placeholder="Informe sua nova senha"
                  visible={true}
                />
                <InputComponent
                label="Confirme a nova senha"
                value={confirmPassword}
                setValue={setConfirmPassword}
                placeholder="Confirme sua senha"
                visible={true}
                />
              
             
              </View>
            </View>

            
            
           
            <ButtonComponent onPress={UpdateData} title='confirmar' loading={loadingButton} />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {},
  content: {
    paddingHorizontal: 10,
    paddingTop: 10,
    gap: 14,
    paddingBottom: 80,
flex:1
  },
  card: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
  },
  titleCard: {
    fontFamily: "Poppins-Medium",
    color: colors.primary,
    fontSize: 14,
  },
  containerInputs: {
    paddingTop: 10,
    gap: 10,
  },
  imagePicker: {
    backgroundColor: colors.light,
    borderRadius: 10,
    padding: 10,
    flexDirection:'row',
    gap:4,
    alignItems:'center'
  },
  imageSend:{
    color:colors.primary
  },
   label: {
      fontFamily: "Poppins-Medium",
      fontSize:12
    },
    containerInput: {},
    input: {
      backgroundColor: "#fff",
      padding: 14,
      borderWidth: 0.2,
      borderRadius: 10,
    },
    inputFocus: {
      backgroundColor: "#fff",
      padding: 14,
      borderWidth: 0.2,
      borderRadius: 10,
      borderColor: colors.primary,
    },
});

export default Security;
