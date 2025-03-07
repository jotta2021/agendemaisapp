import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Calendar, LocaleConfig, Agenda } from "react-native-calendars";
import { ptBR } from "date-fns/locale";
import colors from "@/assets/colors";
const height = Dimensions.get("screen").height;


interface agendamento{
  name: string,
   
  hour_start: string
  hour_end:string,
  paid: string,
  id_user: string
}

const AgendaPage = () => {
  const agendamentos = [
    {
      id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      date: new Date("2025-03-10T08:00:00Z"),
      hour_start: new Date("2025-03-10T08:00:00Z"),
      hour_end: new Date("2025-03-10T09:00:00Z"),
      paid: true,
      id_user: "João",
      id_enterprise: "enterprise1",
      services: [{ id: "service1", name: "Corte de cabelo", price: 50 }],
      payment: [
        {
          id: "payment1",
          amount: 70,
          method: "Cartão de crédito",
          status: "Pago",
        },
      ],
    },
    {
      id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      date: new Date("2025-03-10T10:00:00Z"),
      hour_start: new Date("2025-03-10T10:00:00Z"),
      hour_end: new Date("2025-03-10T11:00:00Z"),
      paid: true,
      id_user: "Joanderson",
      id_enterprise: "enterprise1",
      services: [
        { id: "service1", name: "Corte de cabelo", price: 50 },
        { id: "service2", name: "Barba", price: 20 },
      ],
      payment: [
        {
          id: "payment1",
          amount: 70,
          method: "Cartão de crédito",
          status: "Pago",
        },
      ],
    },
   
    {
      id: "f7g8h9i0-j1k2-l3m4-n5o6-p7q8r9s0t1u2",
      date: new Date("2025-03-11T15:00:00Z"),
      hour_start: new Date("2025-03-11T15:00:00Z"),
      hour_end: new Date("2025-03-11T16:00:00Z"),
      paid: false,
      id_user: "Tiago",
      id_enterprise: "enterprise2",
      services: [{ id: "service3", name: "Massagem relaxante", price: 100 }],
      payment: [],
    },
    {
      id: "v1w2x3y4-z5a6-b7c8-d9e0-f1g2h3i4j5k6",
      date: new Date("2025-03-12T09:00:00Z"),
      hour_start: new Date("2025-03-12T09:00:00Z"),
      hour_end: new Date("2025-03-12T10:30:00Z"),
      paid: true,
      id_user: "José",
      id_enterprise: "enterprise1",
      services: [
        { id: "service4", name: "Consulta médica", price: 150 },
        { id: "service5", name: "Exame de sangue", price: 80 },
      ],
      payment: [
        { id: "payment2", amount: 230, method: "Boleto", status: "Pago" },
      ],
    },
    {
      id: "a3b4c5d6-e7f8-g9h0-i1j2-k3l4m5n6o7p8",
      date: new Date("2025-03-14T14:00:00Z"),
      hour_start: new Date("2025-03-14T14:00:00Z"),
      hour_end: new Date("2025-03-14T15:00:00Z"),
      paid: false,
      id_user: "Rafael",
      id_enterprise: "enterprise3",
      services: [{ id: "service6", name: "Corte e penteado", price: 120 }],
      payment: [],
    },
  ];

  const agendaItems = agendamentos.reduce((acc: { [key: string]: agendamento[] }, agendamento) => {
    const dateKey = agendamento.date.toISOString().split("T")[0]; // Formato yyyy-mm-dd
    const item = {
      name: `Agendamento de ${agendamento.services
        .map((service) => service.name)
        .join(", ")}`,
      hour_start: agendamento.hour_start.toLocaleTimeString(),
      hour_end: agendamento.hour_end.toLocaleTimeString(),
      paid: agendamento.paid ? "Pago" : "Não pago",
      id_user: agendamento.id_user,
    };

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(item);

    return acc;
  }, {});


  return (
    <SafeAreaView style={styles.container}>
      <Agenda
        style={styles.agenda}
        locale={ptBR}
        items={agendaItems}
        renderItem={(item: agendamento) => {
          console.log(item);
          return (
            <TouchableOpacity style={styles.contentItem}>
              <Text > {item.hour_start} - {item.hour_end}</Text>
              <Text style={styles.title}>{item.id_user}</Text>
              <Text style={styles.service}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
        loadItemsForMonth={() => {
          console.log("trigger items loading");
        }}
        renderEmptyDate={() => {
          return (
            <View>
              <Text>Sem agendamentos neste dia</Text>
            </View>
          )
        }}
        renderEmptyData={() => {
          return (
            <View style={styles.emptyData}>
            <Text style={styles.emptyText}>Sem agendamentos neste dia</Text>
          </View>
          )
        }}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor:colors.primary,
          selectedDayTextColor: '#ffffff',
          todayTextColor: colors.primary,
          dayTextColor: '#2d4150',
          textDisabledColor: '#dd99ee' ,
          
        }}
      ></Agenda>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    marginStart:10,
    marginEnd:10,
    paddingBottom:10
  },
  agenda: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    height: height,
  },
  contentItem: {
    justifyContent: "center",
    backgroundColor: colors["primary-light"],
    borderRadius: 5,
    padding: 5,
    flex: 1,
    marginTop: 25,
    paddingBottom: 25,
  },
  title: {
    fontFamily: "Poppins-Bold",
    color: colors.gray,
    fontSize:16
  },
  service: {
    fontFamily: "Poppins-Regular",
    color: colors.gray
  },
  emptyData:{
    alignItems:'center',
  paddingTop:20
  },
emptyText:{
  color:colors.primary,
  fontFamily:'Poppins-Medium'
}
});

export default AgendaPage;
