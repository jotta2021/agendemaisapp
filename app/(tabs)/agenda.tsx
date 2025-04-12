import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Platform
} from "react-native";
import { Agenda } from "react-native-calendars";
import colors from "@/assets/colors";
import api from "../hooks/apiService";
import { context } from "../_contexts";
import { Toast } from "react-native-toast-notifications";
import { useFocusEffect } from "expo-router";
import { format } from "date-fns";
import * as Calendar from 'expo-calendar';
import { AntDesign } from "@expo/vector-icons";
const height = Dimensions.get("screen").height;

interface Agendamento {
  hour_start: Date;
  hour_end: Date;
  name: string;
  paid: string;
  id_user: string;
  date: string;
  services: [
    {
      name: string;
    }
  ];
  user: {
    name: string;
  };
  professional: {
    name: string;
  };
}

const AgendaPage = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { user } = useContext(context);
  const [appointments, setAppointments] = useState<Agendamento[]>([]);
  


  useEffect(() => {
    async function getCalendarPermissions() {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        console.log('Permissão concedida!');
      } else {
        console.log('Permissão negada!');
      }
    }
    getCalendarPermissions();
  }, []);




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
        paid: agendamento.paid ? "Pago" : "Não pago",
        user: agendamento?.user,
        professional: agendamento.professional,
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
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  
    const editableCalendar = calendars.find(
      (cal) =>
        cal.allowsModifications &&
        cal.source?.name !== 'Subscribed Calendars' // evitar calendários de leitura apenas
    );
  
    if (!editableCalendar) {
      throw new Error("Nenhum calendário editável encontrado no iPhone.");
    }
  
    return editableCalendar.id;
  }
  
  
  
  // Função para exportar os agendamentos para o calendário
  // Essa função deve ser chamada quando o usuário clicar no botão de exportar
  async function exportarParaCalendario() {
    try {
      const calendarId = await getOrCreateCalendar();
  
      for (const agendamento of appointments) {
        const start = new Date(agendamento.hour_start);
        const end = new Date(agendamento.hour_end);
  
        await Calendar.createEventAsync(calendarId, {
          title: agendamento.services.map((s) => s.name).join(", "),
          notes: `Cliente: ${agendamento.user.name}\n ${agendamento.professional && `Profissional: ${agendamento.professional.name}` }`,
          startDate: start,
          endDate: end,
          timeZone: 'America/Sao_Paulo',
        });
      }
  
      Toast.show('Agendamentos exportados para o calendário com sucesso!', { type: "success" });
    } catch (error) {
      console.log(error);
      Toast.show('Erro ao exportar para o calendário.', { type: "danger" });
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
        onDayPress={(day :any) => setSelectedDate(day.dateString)}
        renderItem={(item: Agendamento) =>{ 

          return(
          <TouchableOpacity style={styles.contentItem}>
            <Text>
              {formatHour(item.hour_start)} - {formatHour(item.hour_end)}
            </Text>
            <Text style={styles.title}>{item?.user?.name}</Text>
            <Text style={styles.service}>{item?.name}</Text>
            {item.professional && (
              <Text>Profissional: {item?.professional?.name}</Text>
            )}
          </TouchableOpacity>
        )}} 
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
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap:5
  }}
  onPress={exportarParaCalendario}
>
  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Exportar para Calendário</Text>
  <AntDesign name="export" size={24} color="white"/>
</TouchableOpacity>
      </View>

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
});

export default AgendaPage;
