import colors from "@/assets/colors";
import { Tabs } from "expo-router";
import { View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
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
          title: "Principal",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
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
        name="cadastro"
        options={{
          title: "Cadastros",
          tabBarLabel: "",
          tabBarIcon: ({ color, size }) => <ButtonNew size={size} />,
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

function ButtonNew({ size }: { size: number }) {
  return (
    <View
      style={{
        backgroundColor: colors.primary,
        width: 60,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 60,
        marginBottom: 20,
      }}
    >
      <Ionicons size={size} name="add" color="white" />
    </View>
  );
}

/**
 *
 *
 */
export default LayoutHome;
