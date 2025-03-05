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
    id: ''
  });
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [nameEnterprise, setNameEnterprise] = useState("");
  const [description, setDescription] = useState("");
  const [color_header, setColor_header] = useState("");
  const [img_profile, setImg_profile] = useState("");
  const [banner, setBanner] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [address, setAdress] = useState("");
  const [district, setDistrict] = useState("");
  const [number, setNumber] = useState("");
const [cep,setCep] = useState('')
  //image files
  const [profileFile, setProfileFile] = useState<string| null>(null);
  const [banneFile, setBannerFile] = useState<string| null>(null);
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
  const formdata = new FormData();
setLoadingButton(true)
 

  try {
    const res = await api.put('/enterprise/update',{
      headers: {
        "Content-Type": "multipart/form-data",
        "Accept": "application/json",
      },
    });
    setLoadingButton(false)
    Toast.show("Dados atualizados", { type: 'success' });
  } catch (error: unknown) {
    setLoadingButton(false);
  
    if (error instanceof Error) {
      console.log('Erro da API:', (error as any).response?.data || error.message);
      Toast.show(`Erro ao atualizar dados: ${error.message}`, { type: 'danger' });
    } else {
      console.log('Erro desconhecido:', error);
      Toast.show('Ocorreu um erro inesperado.', { type: 'danger' });
    }
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
                <InputComponent
                  label="Email"
                  value={email}
                  setValue={setEmail}
                  placeholder="Email"
                />
                <InputComponent
                  label="Nova senha"
                  value={description}
                  setValue={setDescription}
                  placeholder="Descrição da sua loja"
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
  }
});

export default Security;
