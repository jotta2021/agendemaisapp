import colors from "@/assets/colors";
import { Tabs } from "expo-router";
import { View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import Cleaning from 'react-native-vector-icons/MaterialIcons'
const LayoutHome = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Serviços",
          tabBarIcon: ({ color }) => (
            <Cleaning size={28} name="cleaning-services" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          title: "Agenda",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="calendar-o" color={color} />
          ),
        }}
      />
     
      <Tabs.Screen
        name="myLoja"
        options={{
          title: "Minha loja",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="storefront" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Meus dados",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
};


export default LayoutHome;
