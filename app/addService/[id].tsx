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
  Image,
  Switch,
} from "react-native";
import InputComponent from "../_components/InputComponent";
import InputMasKComponent from "../_components/InputMaskComponent";
import { Dropdown } from "react-native-element-dropdown";
import ButtonComponent from "../_components/buttonComponent";
import colors from "@/assets/colors";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import api from "../hooks/apiService";
import { context } from "../_contexts";
import { Toast } from "react-native-toast-notifications";
import formatCurrencyToNumber from "../hooks/formatCurrencytoNumber";
import { AxiosError } from "axios";
import Entypo from "react-native-vector-icons/Entypo";
import * as ImagePicker from "expo-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import LoadingComponent from "../_components/LoadingComponent";

type Category = {
  id: string;
  name: string;
};
type CategoryInSelect = {
  value: string;
  label: string;
};

const addService = () => {
  const { id } = useLocalSearchParams();
console.log('id', id)
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("00:00");
  const [value, setValue] = useState("");
  const [openTime, setOpenTime] = useState(false);
  const [categorisesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(context);
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [image, setImage] = useState("");
  const [status, setStatus] = useState(false);
  const navigation = useNavigation();

  const showDatePicker = () => {
    setOpenTime(true);
  };

  const hideDatePicker = () => {
    setOpenTime(false);
  };

  const handleConfirm = (date: Date) => {
    const dateString = format(date, "HH:mm");
    setTime(`${dateString}:00`);
    hideDatePicker();
  };

  async function getServiceById() {
    setLoading(true)
    await api
      .get(`/serviceById?id_service=${id}`)
      .then((res) => {
        const data = res.data;
        console.log(data);
        setName(data.name);
        setCategory(data.id_category);
        setDescription(data.description);
        setTime(data.time);
        setValue(data.value);
        setImage(data.image);
        setStatus(data.status);
        setLoading(false)

      })
      .catch((error) => {
        Toast.show("Erro ao buscar serviço", { type: "danger" });
        setLoading(false)
        console.log(error);
      });
  }

  useEffect(() => {
    navigation.setOptions({
      title: id !== "[id]" ? "Atualizar Serviço" : "Adicionar Serviço",
    });
    getServiceById();
  }, [id]);

  async function getCategories() {
    await api
      .get(`/categorieServiceAll?id_enterprise=${user && user.id}`)
      .then((res) => {
        const data = res.data;
        const categories = data.map((item: Category) => ({
          label: item.name,
          value: item.id,
        }));
        setCategoriesList(categories);
      })
      .catch((error) => {
        Toast.show("Erro ao buscar categorias", { type: "danger" });
      });
  }

  useEffect(() => {
    getCategories();
  }, []);

  //pedir a permissao para acessar a galeria do celular
  const pickImage = async () => {
    // o type informa se é a imagem para o perfil ou banner

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageFile(result.assets[0].uri);
    }
  };

  async function updateService() {
    if (name !== "" && value !== "" && time !== "" && category !== "") {
      try {
        setLoading(true);
        const data = {
          id: id,
          name: name,
          description: description,
          value: formatCurrencyToNumber(value),
          time: time,
          id_category: category,
          id_enterprise: user?.id,
          image: "",
          status: status
        };
        console.log(data);
        const formdata = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formdata.append(key, value.toString());
          }
        });

        if (imageFile) {
          const uri = imageFile;

          // Pegando o tipo do arquivo e criando um objeto File
          const fileType = uri.split(".").pop(); // Pegando a extensão do arquivo
          const fileName = `profile.${fileType}`;

          // Convertendo o URI em um objeto File
          const file = {
            uri: uri,
            name: fileName,
            type: `image/${fileType}`,
          };

          // Adicionando a imagem ao FormData
          formdata.append("image", file as never);
        } else {
          formdata.append("image", image);
        }

        await api.put("/service/update", formdata, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setLoading(false);
        Toast.show("Serviço atualizado", { type: "success" });
        setCategory("");
        setDescription("");
        setName("");
        setTime("");
        setImageFile(null);
        setImage("");
        router.push("/(tabs)");
      } catch (error) {
        setLoading(false);
        const axiosError = error as AxiosError;
        console.log(axiosError);
        Toast.show(`Erro ao atualizar serviço ${axiosError?.response?.data}`, {
          type: "danger",
        });
      }
    } else {
      Toast.show("Preencha os campos obrigatórios");
    }
  }

   async function registerService() {
      if (name !== "" && value !== "" && time !== "" && category !== "") {
        try {
          setLoading(true);
          const data = {
            name: name,
            description: description,
            value: formatCurrencyToNumber(value),
            time: time,
            id_category: category,
            id_enterprise: user?.id,
            image: "",
          };
          const formdata = new FormData();
          Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              formdata.append(key, value.toString());
            }
          });
  
          if (imageFile ) {
            const uri = imageFile;
        
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
            formdata.append('image', file as never);
          }
        
  
          await api.post("/service", formdata, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          setLoading(false);
          Toast.show("Serviço adicionado", { type: "success" });
          setCategory("");
          setDescription("");
          setName("");
          setTime("");
          setImageFile(null)
          setImage('')
          router.push("/(tabs)");
        } catch (error) {
          setLoading(false);
          const axiosError = error as AxiosError;
          console.log(axiosError);
          Toast.show(`Erro ao adicionar serviço ${axiosError?.response?.data}`, {
            type: "danger",
          });
        }
      } else {
        Toast.show("Preencha os campos obrigatórios");
      }
    }

  const renderItem = (item: CategoryInSelect) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
    {
      loading  ?
      <View style={{height:'100%', justifyContent:'center', alignItems:'center'}}>
         <LoadingComponent  />
      </View>
      :
      

      <ScrollView
      style={{ marginStart: 10, marginEnd: 10 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            {imageFile && (
              <Image source={{ uri: imageFile }} style={styles.image} />
            )}
            {image !== "" && !imageFile && (
              <Image source={{ uri: image }} style={styles.image} />
            )}

            <Entypo name="camera" color={colors.primary} size={40} />
            <Text style={{ color: colors.primary }}>Selecionar imagem</Text>
          </TouchableOpacity>
        </View>

        <InputComponent
          label="Nome"
          placeholder="Informe qual o serviço"
          value={name}
          setValue={setName}
        />
        <Text style={styles.label}>Categoria</Text>
        <View>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={categorisesList}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="selecionar categoria"
            searchPlaceholder="Buscar categoria..."
            value={category}
            onChange={(item) => {
              setCategory(item.value);
            }}
            renderItem={renderItem}
          />
          <TouchableOpacity
            onPress={() => router.push("/addCategory/category")}
          >
            <Text style={{ color: colors.primary }}>Nova categoria</Text>
          </TouchableOpacity>
        </View>

        <InputComponent
          label="Descrição"
          placeholder="Descreva o serviço"
          value={description}
          setValue={setDescription}
        />

        <Text style={styles.label}>Tempo estimado</Text>
        <TouchableOpacity
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            padding: 14,
            borderWidth: 0.2,
            borderColor: "grey",
          }}
          onPress={showDatePicker}
        >
          <Text>{time}</Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={openTime}
          mode="time"
          onConfirm={handleConfirm}
          locale={"pt_BR"}
          onCancel={hideDatePicker}
        />

        <InputMasKComponent
          label="Valor"
          maskType="currency"
          placeholder="Informe o valor do serviço"
          value={value}
          setValue={setValue}
        />
        {
          id !== "[id]" && (
            <View style={styles.containerSwitch}>
          <Text>Ativo</Text>
          <Switch
            value={status}
            onValueChange={setStatus}
            trackColor={{ false: "#767577", true: colors.primary }}
          
          />
        </View>
          )
        }
        

        <View style={styles.containerButton}>
          <ButtonComponent
            title="Salvar"
            onPress={()=> {
              //verifica se tem um id valido
            if(id==='[id]'){
              registerService()
            }else{
              updateService()
            }
          }
        }
            loading={loading}
          />
        </View>
      </View>
    </ScrollView>
    }
     
    </KeyboardAvoidingView>
  );
};

const width = Dimensions.get("screen").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 10,
    gap: 10,
    paddingBottom: 80,
  },
  imageContainer: {
    width: width * 0.9,
    height: 200,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  image: {
    width: width * 0.9,
    height: 200,
    objectFit: "cover",
    opacity: 0.5,
    position: "absolute",
  },
  dropdown: {
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  label: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
  },
  containerButton: {
    marginTop: 20,
  },
containerSwitch:{
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center'	,
    gap:10
}
});
export default addService;
