import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
} from "react-native";
import { Agenda } from "react-native-calendars";
import colors from "@/assets/colors";
import api from "../hooks/apiService";
import { context } from "../_contexts";
import { Toast } from "react-native-toast-notifications";
import { useFocusEffect } from "expo-router";
import { format } from "date-fns";
import * as Calendar from "expo-calendar";
import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import { Dialog } from "@rneui/themed";
import { Linking } from "react-native";
const height = Dimensions.get("screen").height;

interface Agendamento {
  id: string;
  hour_start: Date;
  hour_end: Date;
  name: string;
  paid: string;
  id_user: string;
  date: string;
  exported: boolean;
  status: string;
  services: [
    {
      name: string;
    }
  ];
  user: {
    name: string;
    phone:string
  };
  professional: {
    name: string;
  };
}

const AgendaPage = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { user } = useContext(context);
  const [appointments, setAppointments] = useState<Agendamento[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Agendamento | null>(null);

  async function getAppointments() {
    try {
      const res = await api.get(`/appointments?id_enterprise=${user?.id}`);

      const data = res.data;
      const agendamentos = data.map((item: Agendamento) => ({
        ...item,
        date: format(item.date, "yyyy-MM-dd"),
      }));
      setAppointments(agendamentos);
    } catch (error) {
      Toast.show(`Erro ao buscar agendamentos ${error}`, { type: "danger" });
      console.log(error?.response?.data);
    }
  }
  useFocusEffect(
    useCallback(() => {
      getAppointments();
    }, [])
  );

  // Formata os dados para serem usados no calendário
  const agendaItems = appointments.reduce(
    (acc: { [key: string]: Agendamento[] }, agendamento) => {
      const dateKey = agendamento.date;
      const item = {
        name: agendamento.services.map((s) => s.name).join(", "),
        hour_start: new Date(agendamento.hour_start),
        hour_end: new Date(agendamento.hour_end),
        paid: agendamento.paid ,
        user: agendamento?.user,
        professional: agendamento.professional,
        status: agendamento?.status,
        exported: agendamento.exported,
        id: agendamento.id,
      };

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }

      acc[dateKey].push(item as never);

      // Ordena os agendamentos pela hora de início
      acc[dateKey].sort(
        (a: Agendamento, b: Agendamento) =>
          new Date(a.hour_start).getTime() - new Date(b.hour_start).getTime()
      );

      return acc;
    },
    {}
  );

  function formatHour(value: Date) {
    return format(value, "HH:mm");
  }

  async function getOrCreateCalendar() {
    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT
    );

    const editableCalendar = calendars.find(
      (cal) =>
        cal.allowsModifications && cal.source?.name !== "Subscribed Calendars" // evitar calendários de leitura apenas
    );

    if (!editableCalendar) {
      throw new Error("Nenhum calendário editável encontrado.");
    }

    return editableCalendar.id;
  }

  // Função para exportar os agendamentos para o calendário
  // Essa função deve ser chamada quando o usuário clicar no botão de exportar
  async function exportarParaCalendario() {
    try {
      const calendarId = await getOrCreateCalendar();

      //so ira exportar os agendamentos que ainda nao foram exportados, pra evitar que fiquem duplicados no calendario do celular
      //caso expore mais de uma vez
      for (const agendamento of appointments) {
        if (agendamento.exported === false) {
          const start = new Date(agendamento.hour_start);
          const end = new Date(agendamento.hour_end);

          await Calendar.createEventAsync(calendarId, {
            title: agendamento.services.map((s) => s.name).join(", "),
            notes: `Cliente: ${agendamento.user.name}\n ${
              agendamento.professional &&
              `Profissional: ${agendamento.professional.name}`
            }`,
            startDate: start,
            endDate: end,
            timeZone: "America/Sao_Paulo",
          });
          //atualiza o campo exportado
          await api
            .put("/appointments/update", {
              id: agendamento.id,
              paid: agendamento.paid,
              exported: true,
              status: agendamento.status,
            })
            .then((res) => {
              console.log("Exportado atualizado para true");
            })
            .catch((error) => {
              console.log("Erro ao atualizar campo exportado");
            });
          Toast.show("Agendamentos exportados para o calendário com sucesso!", {
            type: "success",
          });
        } else {
          Toast.show("Todos os agendamentos já foram exportados.");
        }
      }
      getAppointments()
    } catch (error) {
      console.log(error);
      Toast.show(`Erro ao exportar para o calendário.${error}`, {
        type: "danger",
      });
    }
  }


  async function SendMessageWhatsapp(){
    const message = `👋 Olá ${selectedItem?.user.name}, tudo bem?

    📅 Seu agendamento está confirmado para o dia ${format(new Date(selectedItem?.hour_start), 'dd/MM/yyyy')} às 🕒 ${format(new Date(selectedItem?.hour_start), 'HH:mm')}.
    
    💬 Qualquer dúvida, estou à disposição! 😊`;
const phoneNumber = selectedItem?.user?.phone &&  selectedItem?.user?.phone.replace(/\D/g, '') 
const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

Linking.openURL(url)
.then((suported)=> {
  if(suported){
    return Linking.openURL(url)
  }else{
    Alert.alert('WhatsApp não instalado')
  }
})
.catch((error) => {
  console.log('Erro ao abrir o WhatsApp:', error);
});
}


async function ConfirmAppointment(){
console.log(selectedItem)
  try {
    console.log({  id: selectedItem?.id,
      paid: selectedItem?.paid,
      exported: selectedItem?.exported,
      status: 'confirmado'})
    await api.put('/appointments/update', {
      id: selectedItem?.id,
      paid: selectedItem?.paid,
      exported: selectedItem?.exported,
      status: 'confirmado'
    })
  
    Toast.show('Agendamento confirmado com sucesso!', {type:'success'})
    setOpenModal(false)
    setSelectedItem(null)
    getAppointments()
  } catch (error) {
    console.log(error)
    Toast.show('Erro ao confirmar agendamento', {type:'danger'})
  }
}

  return (
    <SafeAreaView style={styles.container}>
      <Agenda
        style={styles.agenda}
        items={
          selectedDate
            ? { [selectedDate]: agendaItems[selectedDate] || [] }
            : {}
        }
        selected={selectedDate || Object.keys(agendaItems)[0]}
        onDayPress={(day: any) => setSelectedDate(day.dateString)}
        renderItem={(item: Agendamento) => {
          return (
            <TouchableOpacity
              style={styles.contentItem}
              onPress={() =>{
                setSelectedItem(item);
                setOpenModal(true)
              } }
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>
                  {formatHour(item.hour_start)} - {formatHour(item.hour_end)}
                </Text>
                <Text>{item.status}</Text>
              </View>

              <Text style={styles.title}>{item?.user?.name}</Text>
              <Text style={styles.service}>{item?.name}</Text>
              {item.professional && (
                <Text>Profissional: {item?.professional?.name}</Text>
              )}
            </TouchableOpacity>
          );
        }}
        renderEmptyData={() => (
          <View style={styles.emptyData}>
            <Text style={styles.emptyText}>Sem agendamentos neste dia</Text>
          </View>
        )}
        theme={{
          backgroundColor: "#ffffff",
          calendarBackground: "#ffffff",
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: "#ffffff",
          todayTextColor: colors.primary,
          dayTextColor: "#2d4150",
        }}
      />
      <View style={{ padding: 10 }}>
        <TouchableOpacity
          style={{
            backgroundColor: colors.primary,
            padding: 12,
            borderRadius: 6,
            alignItems: "center",
            marginBottom: 10,
            flexDirection: "row",
            justifyContent: "center",
            gap: 5,
          }}
          onPress={exportarParaCalendario}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Exportar para Calendário
          </Text>
          <AntDesign name="export" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <Dialog isVisible={openModal} onBackdropPress={() => setOpenModal(false)}>
        <View style={styles.headerModal}>
          <Text style={styles.titleModal}>Profissional. {selectedItem && selectedItem?.professional.name}</Text>
          <Text style={styles.subttleModal}>Cliente: {selectedItem && selectedItem?.user.name}</Text>
        </View>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.buttonModal} onPress={SendMessageWhatsapp}>
            <Text style={{color:colors.primary, fontWeight:'500'}}>Entrar em contato com cliente</Text>
          </TouchableOpacity>
         
          <TouchableOpacity style={styles.buttonModal} onPress={ConfirmAppointment}>
            <Text style={{ fontWeight:'500'}}>Confirmar agendamento</Text>
            <Entypo name="check" size={20} color={'green'}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonModal}>
            {" "}
            <Text style={{ fontWeight:'500'}}>Concluir agendamento e serviço</Text>
            <Entypo name="check" size={20} color={'green'}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonModal}>
            <Text style={{ fontWeight:'500'}}>Cancelar agendameno</Text>
            <Feather name="x" size={20} color={'red'}/>
          </TouchableOpacity>
        </View>
      </Dialog>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  agenda: {
    borderRadius: 10,
    height: height,
  },
  contentItem: {
    justifyContent: "center",
    backgroundColor: colors["primary-light"],
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  title: {
    fontFamily: "Poppins-Bold",
    color: colors.gray,
    fontSize: 16,
  },
  service: {
    fontFamily: "Poppins-Regular",
    color: colors.gray,
  },
  emptyData: {
    alignItems: "center",
    paddingTop: 20,
  },
  emptyText: {
    color: colors.primary,
    fontFamily: "Poppins-Medium",
  },
  modal: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 20,
    paddingTop: 10,
  },
  headerModal: {},
  titleModal: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
  },
  subttleModal: {
    color: "grey",
  },
  buttonModal:{
    backgroundColor:colors.light, padding:10 , borderRadius:6,
    flexDirection:'row', 
    alignItems:'center', 
    gap:2,
    width:'100%',
    justifyContent:'center',
  }
});

export default AgendaPage;
