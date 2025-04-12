import ButtonComponent from "@/app/_components/buttonComponent";
import InputComponent from "@/app/_components/InputComponent";
import InputMasKComponent from "@/app/_components/InputMaskComponent";
import api from "@/app/hooks/apiService";
import colors from "@/assets/colors";
import { Switch } from "@rneui/themed";
import { router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Toast } from "react-native-toast-notifications";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import DaysSelect from "@/app/_components/daysSelect";
import { context } from "@/app/_contexts";
import LoadingComponent from "@/app/_components/LoadingComponent";
// import { Container } from './styles';

type Service = {
  name: string;
  id: string;
};
type DaySchedule = {
  day: number;
  status: boolean;
  morning_start: string;
  morning_end: string;
  afternoon_start: string;
  afternoon_end: string;
  interval: string;
};
const ProfissionalItem = () => {
  const { id } = useLocalSearchParams();
  const { user } = useContext(context);
  const [professional, setProfessional] = useState([]);
  const [services, setServices] = useState<Service[]>([]);
  const [servicesSelecteds, setServicesSelecteds] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cargo, setCargo] = useState("");
  const [status, setStatus] = useState(true);
  const [loadFunction,setLoadFunction] =useState(false)
  const [password,setPassword] = useState('')
const [loading,setLoading] = useState(false)
  const [schedules, setSchedules] = useState<DaySchedule[]>(
    Array.from({ length: 7 }, (_, i) => ({
      day: i + 1,
      status: false,
      morning_start: "08:00",
      morning_end: "12:00",
      afternoon_start: "14:00",
      afternoon_end: "18:00",
      interval: "00:30",
    }))
  );

  async function getProfessional() {
    setLoading(true)
    await api
      .get(`/professionalById?id_professional=${id}`)
      .then((res) => {
        setProfessional(res.data);
        const profissional = res.data;
        setName(profissional.name);
        setEmail(profissional.email);
        setPhone(profissional.phone);
        setCargo(profissional.role);
        setStatus(profissional.status)
        setDescription(profissional.description)
        if (profissional.schedules && profissional.schedules.length > 0) {
          setSchedules(profissional.schedules);
        }

        if (profissional.services && profissional.services.length > 0) {
          const services = profissional.services;
          setServicesSelecteds(services.map((item: Service) => item.id));
        }
        setLoading(false)
      })
      .catch((error) => {
        Toast.show(`${error?.response?.data?.message}`, { type: "danger" });
        setLoading(false)
      });
  }

  async function getServices() {
    await api
      .get(`/servicesByEnterprise?id_enterprise=${user?.id}`)
      .then((res) => {
        setServices(res.data);
      })
      .catch((error) => {
        Toast.show(`Erro ao buscar os serviços ${error?.response?.data}`);
      });
  }
  useEffect(() => {
 
    if(id !== '[id]'){
       getProfessional()
   
    }
       
   
   
  }, [id]);

  useEffect(()=> {
    getServices()
  },[])

  // funcao pra atualizar profissional
  
  async function UpdateProfessional() {
    setLoadFunction(true)
    const data = {
      name: name,
      email: email,
      phone: phone,
      description: description,
      role: cargo,
      status: status,
      id: id,
      services :servicesSelecteds
    };

    await api
      .put(`/updateProfessional`, data)
      .then((res) => {
        Toast.show("Profissional atualizado", { type: "success" });
        setLoadFunction(false)
        router.back();
      })
      .catch((error) => {
        Toast.show(`Ocorreu um erro ${error?.response?.data?.message}`, {
          type: "danger",
        });
        setLoadFunction(false)
      });
  }



  async function CreateProfessional(){
    if(name!=='' && email!=='' && phone!=='' && cargo!=='' && servicesSelecteds.length>0 ){
      const data = {
        name: name,
        email: email,
        phone: phone,
        description: description,
        role: cargo,
        status: status,
        services :servicesSelecteds,
        id_enterprise: user?.id,
        schedules: schedules,
        password:password
      };
  
      await api
        .post(`/Registerprofesional`, data)
        .then((res) => {
          Toast.show("Profissional cadastrado", { type: "success" });
          setLoadFunction(false)
          router.back();
        })
        .catch((error) => {
          Toast.show(`Ocorreu um erro ${error?.response?.data?.message}`, {
            type: "danger",
          });
          console.log(error.response)
          setLoadFunction(false)
        });
    }else{
      Toast.show("Preencha os campos obrigatórios")
    }
  }

  return (
    <ScrollView style={styles.container}>
        {
            loading ?
            <View    style={{
                height: "90%",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <LoadingComponent/>  
            </View>
             :
            <View style={styles.form}>
            <InputComponent
              label="Nome"
              placeholder="Informe o nome do profissional"
              value={name}
              setValue={setName}
            />
            <InputComponent
              label="Descrição"
              placeholder="Informe a descrição do profissional"
              value={description}
              setValue={setDescription}
            />
            <InputComponent
              label="Email"
              placeholder="Informe o email "
              value={email}
              setValue={setEmail}
            />
            <InputMasKComponent
              label="Telefone"
              placeholder="Informe o telefone "
              maskType="phone"
              value={phone}
              setValue={setPhone}
            />
            <InputComponent
              label="Cargo"
              placeholder="Qual o cargo do profissional"
              value={cargo}
              setValue={setCargo}
            />
             <InputComponent
              label="Senha"
              placeholder="Crie uma senha"
              value={password}
              setValue={setPassword}
              security={true}
              visible={true}
            />
            {
              id !== '[id]' &&
                 <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Switch
                value={status}
                onValueChange={() => setStatus(!status)}
                trackColor={{ false: "#ccc", true: colors.primary }}
                thumbColor="#fff"
              />
              <Text>Status</Text>
            </View>
            }
          
    
            <DaysSelect schedules={schedules} setSchedules={setSchedules} />
    
            {/** mostra os servicos para vincular ao profissional */}
            <View>
              <Text style={styles.title}>Vincule serviços a este profissional</Text>
              <FlatList
                data={services}
                keyExtractor={(item, index) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10, flexWrap: "wrap" }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.categoryContainer,
                      {
                        backgroundColor: servicesSelecteds.includes(item.id)
                          ? colors.primary
                          : "#e6e6e6",
                      },
                    ]}
                    onPress={() => {
                      if (servicesSelecteds.includes(item.id)) {
                        const index = servicesSelecteds.filter(
                          (service) => service !== item.id
                        );
                        setServicesSelecteds(index);
                      } else {
                        setServicesSelecteds((prev) => [...prev, item.id]);
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.category,
                        {
                          color: servicesSelecteds.includes(item.id)
                            ? "white"
                            : "black",
                        },
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
            <ButtonComponent title="Confirmar" onPress={ ()=> {
              if(id ==='[id]'){
                CreateProfessional()
              }else{
                UpdateProfessional()
              }
            } }  loading={loadFunction}/>
          </View>
        }
     
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  form: {
    gap: 20,
    paddingBottom: 100,
  },
  dayContainer: {
    alignItems: "center",
    flexDirection: "row",
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
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 12,
    color: colors.dark,
  },
});
export default ProfissionalItem;
