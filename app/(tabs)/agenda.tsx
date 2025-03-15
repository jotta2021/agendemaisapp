import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Agenda } from "react-native-calendars";
import colors from "@/assets/colors";

const height = Dimensions.get("screen").height;

interface Agendamento {
  hour_start: string;
  hour_end: string;
  name: string;
  paid: string;
  id_user: string;
}

const AgendaPage = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const agendamentos = [
    {
      id: "a1b2c3d4",
      date: "2025-03-10",
      hour_start: "08:00",
      hour_end: "09:00",
      paid: true,
      id_user: "João",
      services: [{ name: "Corte de cabelo" }],
    },
    {
      id: "a1b2c3d5",
      date: "2025-03-10",
      hour_start: "10:00",
      hour_end: "11:00",
      paid: true,
      id_user: "Joanderson",
      services: [
        { name: "Corte de cabelo" },
        { name: "Barba" },
      ],
    },
    {
      id: "f7g8h9i0",
      date: "2025-03-11",
      hour_start: "15:00",
      hour_end: "16:00",
      paid: false,
      id_user: "Tiago",
      services: [{ name: "Massagem relaxante" }],
    },
  ];

  // Formata os dados para serem usados no calendário
  const agendaItems = agendamentos.reduce((acc: { [key: string]: Agendamento[] }, agendamento) => {
    const dateKey = agendamento.date;
    const item = {
      name: agendamento.services.map((s) => s.name).join(", "),
      hour_start: agendamento.hour_start,
      hour_end: agendamento.hour_end,
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
        items={selectedDate ? { [selectedDate]: agendaItems[selectedDate] || [] } : {}}
        selected={selectedDate || Object.keys(agendaItems)[0]}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        renderItem={(item: Agendamento) => (
          <TouchableOpacity style={styles.contentItem}>
            <Text>{item.hour_start} - {item.hour_end}</Text>
            <Text style={styles.title}>{item.id_user}</Text>
            <Text style={styles.service}>{item.name}</Text>
          </TouchableOpacity>
        )}
        renderEmptyData={() => (
          <View style={styles.emptyData}>
            <Text style={styles.emptyText}>Sem agendamentos neste dia</Text>
          </View>
        )}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: '#ffffff',
          todayTextColor: colors.primary,
          dayTextColor: '#2d4150',
        }}
      />
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
