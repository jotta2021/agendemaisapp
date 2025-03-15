import React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import colors from "@/assets/colors";
import SearchIcon from "react-native-vector-icons/Feather";
import FontAwesome from 'react-native-vector-icons/FontAwesome6'

interface Props{
  value:string;
  setValue:(text:string) => void;
  openFilter?:()=> void;
  filter?:boolean
}
const SearchBar = ({value,setValue,openFilter,filter}:Props) => {
  return (
    <View style={styles.containerInput}>
      <SearchIcon name="search" size={24} color={colors.gray} />

      <TextInput style={styles.searchBar} placeholder="Buscar" 
      value={value} onChangeText={(text)=> setValue(text)}
      />
      {
        filter &&
        <TouchableOpacity onPress={openFilter}>
  <FontAwesome name="sliders" color={colors.gray} size={20} />
</TouchableOpacity>
      }

      
    </View>
  );
};
const width = Dimensions.get("window").width; 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    position:'relative'
  },
  content: {
    paddingTop: 10,
  },
  title: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
  },
  containerInput: {
    backgroundColor: colors.light,
    borderRadius: 50,
    minHeight: 50,
    padding: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
    paddingHorizontal:4
  },
  searchBar: {
    backgroundColor: colors.light,
    borderRadius: 50,
    width:width* 0.7
  },
});
export default SearchBar;
