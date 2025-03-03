import colors from '@/assets/colors';
import {Tabs} from 'expo-router'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
const LayoutHome = () => {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: colors.primary, headerShown:false }}>
    <Tabs.Screen
      name="index"
      options={{
        title: 'Principal',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
      }}
    />
      <Tabs.Screen
      name="agenda"
      options={{
        title: 'Agenda',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="calendar-o" color={color} />,
      }}
    />
     <Tabs.Screen
      name="cadastro"
      options={{
        title: 'Cadastros',
        tabBarIcon: ({ color }) => <Ionicons size={28} name="add-circle" color={color} />,
      }}
    />
     <Tabs.Screen
      name="myLoja"
      options={{
        title: 'Minha loja',
        tabBarIcon: ({ color }) => <Ionicons size={28} name="storefront" color={color} />,
      }}
    />
      <Tabs.Screen
      name="profile"
      options={{
        title: 'Meus dados',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
      }}
    />
  </Tabs>
  )
};

export default LayoutHome;
