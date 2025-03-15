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
        setName(data?.name_user);
        setNameEnterprise(data?.name_enterprise);
        setDescription(data?.description);
        setEmail(data?.email);
        setCpf(data?.cnpj_cpf);
        setDistrict(data?.district);
        setCity(data?.city);
        setState(data?.state)
        setAdress(data?.adress);
        setNumber(data?.number);
        setColor_header(data?.color_header);
        setImg_profile(data?.img_profile);
        setBanner(data?.banner);
        setCep(data?.cep)
       
       
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


  //pedir a permissao para acessar a galeria do celular
  const pickImage = async (type:string) => {
    // o type informa se é a imagem para o perfil ou banner
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

 

    if (!result.canceled) {
      if(type==='banner'){
        setBannerFile(result.assets[0].uri)
      }else{
        setProfileFile(result.assets[0].uri)
      }
   
    }
  };




async function UpdateData() {
  const formdata = new FormData();
setLoadingButton(true)
  const dataApi = {
    "id": data.id,
    "name_enterprise": nameEnterprise,
    "description": description,
    "cnpj_cpf": cpf,
    "phone": phone,
    "name_user": name,
    "adress": address,
    "color_header": color_header,
    "banner": banneFile ? banneFile : banner,
    "img_profile": profileFile ? profileFile : img_profile,
    "city": city,
    "state": state,
    "district": district,
    "number": number,
    "latitude": null,
    "longitude": null,
   // "cep":cep
  };

  // Verificando se o campo img_profile ou banner é um objeto de arquivo
  if (profileFile ) {
    const uri = profileFile;

    // Pegando o tipo do arquivo e criando um objeto File
    const fileType = uri.split('.').pop(); // Pegando a extensão do arquivo
    const fileName = `profile.${fileType}`;

    // Convertendo o URI em um objeto File
    const file = {
      uri: uri,
      name: fileName,
      type: `image/${fileType}`,
    };

    // Adicionando a imagem ao FormData
    formdata.append('img_profile', file as never);
  }

  if (banneFile ) {
    const uri = banneFile;

    // Pegando o tipo do arquivo e criando um objeto File
    const fileType = uri.split('.').pop(); // Pegando a extensão do arquivo
    const fileName = `banner.${fileType}`;

    // Convertendo o URI em um objeto File
    const file = {
      uri: uri,
      name: fileName,
      type: `image/${fileType}`,
    };

    // Adicionando a imagem ao FormData
    formdata.append('banner', file as never);
  }

  // Adicionando outros dados ao FormData
  Object.entries(dataApi).forEach(([key, value]) => {
    if (value !== null && value !== undefined && key !== 'img_profile' && key !== 'banner') {
      formdata.append(key, value);
    }
  });

  console.log([...formdata]);

  try {
    const res = await api.put('/enterprise/update', formdata, {
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
                <TouchableOpacity style={styles.imagePicker}
                onPress={()=> pickImage('profile')}
                >
                  <ImageIcon name="image" size={24} color={colors.primary}/>
                  <Text>Selecionar imagem de perfil</Text>
                </TouchableOpacity>
                {
                  data.img_profile &&
                  <Text style={styles.imageSend}>Você já enviou uma imagem</Text>
                }
                

                <TouchableOpacity style={styles.imagePicker}
                  onPress={()=> pickImage('banner')}
                >
                  <ImageIcon name="image" size={24} color={colors.primary}/>
                  <Text>Selecionar Banner</Text>
                </TouchableOpacity>
                {
                  data.banner &&
                  <Text style={styles.imageSend}>Você já enviou uma imagem</Text>
                }
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
                <InputMasKComponent
                maskType="cep"
                  label="CEP"
                  value={cep}
                  setValue={setCep}
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
            <View style={styles.card}>
              <Text style={styles.titleCard}>Dados de usuário</Text>

              <View style={styles.containerInputs}>
                <InputComponent
                  label="Nome"
                  value={name}
                  setValue={setName}
                  placeholder="Nome"
                />
               
                <InputMasKComponent
                maskType="cpf"
                  label="CPF/CNPJ"
                  value={cpf}
                  setValue={setCpf}
                  placeholder="Informe a CEP"
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

export default MyData;
