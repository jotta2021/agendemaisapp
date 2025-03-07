import React from 'react';
import { View,Text,TextInput,StyleSheet } from 'react-native';
import colors from "@/assets/colors";
import SearchIcon from "react-native-vector-icons/Feather";
// import { Container } from './styles';

const SearchBar = () => {
  return(

         <View style={styles.containerInput}>
                  <SearchIcon name="search" size={24} color={colors.gray} />
        
                  <TextInput style={styles.searchBar} placeholder="Buscar" />
                </View>
   
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 10,
      
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
      padding:6,
      flexDirection: "row",
      alignItems:'center',
      gap:8
    },
    searchBar: {
      backgroundColor: colors.light,
      borderRadius: 50,
     width:300
    },
  });
export default SearchBar;