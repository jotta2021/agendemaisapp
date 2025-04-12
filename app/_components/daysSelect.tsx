import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';
import { Switch } from '@rneui/themed';
import colors from '@/assets/colors';

const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

type DaySchedule = {
  day: number;
  status: boolean;
  morning_start: string;
  morning_end: string;
  afternoon_start: string;
  afternoon_end: string;
  interval:string
};

interface Props {
    schedules: DaySchedule[]
    setSchedules: ( value:DaySchedule[] )=> void;
}
const DaysSelect = ({schedules,setSchedules}:Props) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [selectedField, setSelectedField] = useState<keyof Omit<DaySchedule, 'day' | 'status'> | null>(null);
  const [timePickerVisible, setTimePickerVisible] = useState(false);



  
  const showTimePicker = (dayIndex: number, field: keyof Omit<DaySchedule, 'day' | 'status'>) => {
    setSelectedDayIndex(dayIndex);
    setSelectedField(field);
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
    setSelectedDayIndex(null);
    setSelectedField(null);
  };

  const handleConfirm = (date: Date) => {
    const time = format(date, 'HH:mm');
    if (selectedDayIndex !== null && selectedField) {
      const updatedSchedules = [...schedules];
      updatedSchedules[selectedDayIndex][selectedField] = time;
      setSchedules(updatedSchedules);
    }
    hideTimePicker();
  };

  const toggleDayActive = (index: number) => {
    const updated = [...schedules];
    updated[index].status = !updated[index].status;
    setSchedules(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Horários de atendimento</Text>

      {schedules.map((schedule, index) => (
        <View key={index} style={styles.dayBlock}>
          <View style={styles.dayHeader}>
            <Switch
              value={schedule.status}
              onValueChange={() => toggleDayActive(index)}
              trackColor={{ false: "#ccc", true: colors.primary }}
              thumbColor="#fff"
            />
            <Text style={styles.dayName}>{dayNames[index]}</Text>
          </View>

          {schedule.status && (
            <View style={styles.timeRow}>
              <TouchableOpacity onPress={() => showTimePicker(index, 'morning_start')} style={styles.timeBtn}>
                <Text>{schedule.morning_start || 'Manhã - Início'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => showTimePicker(index, 'morning_end')} style={styles.timeBtn}>
                <Text>{schedule.morning_end || 'Manhã - Fim'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => showTimePicker(index, 'afternoon_start')} style={styles.timeBtn}>
                <Text>{schedule.afternoon_start || 'Tarde - Início'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => showTimePicker(index, 'afternoon_end')} style={styles.timeBtn}>
                <Text>{schedule.afternoon_end || 'Tarde - Fim'}</Text>
              </TouchableOpacity>

              <View>
                <Text>Intervalo entre os horários</Text>
                <TouchableOpacity onPress={() => showTimePicker(index, 'afternoon_end')} style={styles.timeBtn}>
                <Text>{schedule.interval || 'Intervalo'}</Text>
              </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ))}

      <DateTimePickerModal
        isVisible={timePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideTimePicker}
        locale="pt_BR"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
    color:colors.dark
  },
  dayBlock: {
    marginBottom: 20,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    paddingBottom: 10,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dayName: {
    fontSize: 14,
  },
  timeRow: {
    marginTop: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 10,
  },
  timeBtn: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
});

export default DaysSelect;
