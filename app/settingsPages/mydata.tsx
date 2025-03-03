import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { context } from "../_contexts";
import api from "../hooks/apiService";
import { Toast } from "react-native-toast-notifications";
import InputComponent from "../_components/InputComponent";
import colors from "@/assets/colors";
import ButtonComponent from "../_components/buttonComponent";

// import { Container } from './styles';
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
  color_header:string;
  img_profile:string
  banner:string
}
const MyData = () => {
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
    color_header:"#fff",
    img_profile:"",
    banner:''
  });
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [nameEnterprise, setNameEnterprise] = useState("");
  const [description, setDescription] = useState("");
  const [color_header,setColor_header] =useState('')
  const [img_profile,setImg_profile] =useState('')
  const [banner,setBanner] =useState('')
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [address, setAdress] = useState("");
  const [district, setDistrict] = useState("");
  const [number, setNumber] = useState("");
  
  //image files
  const [profileFile,setProfileFile] = useState(null)
  const [banneFile,setBannerFile] = useState(null)
  async function getData() {
    setLoading(true);
    await api
      .get(`/enterprise?id=${user && user.id}`)
      .then((res) => {
        const data = res.data;
        setLoading(false);
        setData(res.data);
        setName(data?.name_user);
        setNameEnterprise(data?.name_enterprise);
        setDescription(data?.description);
        setEmail(data?.email);
        setCpf(data?.cnpj_cpf);
        setDistrict(data?.district);
        setCity(data?.city);
        setAdress(data?.adress);
        setNumber(data?.number);
        setColor_header(data?.color_header)
        setImg_profile(data?.img_profile)
        setBanner(data?.banner)
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
  
  return (
    <KeyboardAvoidingView behavior="height">
      <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.titleCard}>Sua loja</Text>

          <View style={styles.containerInputs}>
            <InputComponent
              label="Nome"
              value={nameEnterprise}
              setValue={setNameEnterprise}
              placeholder="Nome da sua loja"
            />
            <InputComponent
              label="Descrição"
              value={description}
              setValue={setDescription}
              placeholder="Descrição da sua loja"
            />
              <InputComponent
              label="Cor do topo"
              value={color_header}
              setValue={setColor_header}
              placeholder="Cor do topo da loja "
            />
            <View style={styles.imagePicker}>
              <Text>Selecionar imagem</Text>
            </View>
              <InputComponent
              label="Imagem de perfil"
              value={img_profile}
              setValue={setImg_profile}
              placeholder="Imagem de perfil da loja"
            />
            <InputComponent
              label="Banner"
              value={img_profile}
              setValue={setImg_profile}
              placeholder="Imagem de banner da loja"
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.titleCard}>Endereço</Text>

          <View style={styles.containerInputs}>
            <InputComponent
              label="Endereço"
              value={address}
              setValue={setAdress}
              placeholder="Endereço"
            />
            <InputComponent
              label="Bairro"
              value={district}
              setValue={setDistrict}
              placeholder="Bairro"
            />
              <InputComponent
              label="Número"
              value={number}
              setValue={setNumber}
              placeholder="Informe o número do estabelecimento "
            />
             <InputComponent
              label="CEP"
              value={city}
              setValue={setCity}
              placeholder="Informe a CEP"
            />
              <InputComponent
              label="Cidade"
              value={city}
              setValue={setCity}
              placeholder="Informe a cidade"
            />
            <InputComponent
              label="Estado"
              value={state}
              setValue={setState}
              placeholder="Informe o estado"
            />
          </View>
        </View>
        <ButtonComponent/>
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
    gap:14,
    paddingBottom:30,
    flexGrow:1
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
  imagePicker:{
    backgroundColor:colors.light,
    paddingVertical:10, 
    borderRadius:10
  }
});

export default MyData;
