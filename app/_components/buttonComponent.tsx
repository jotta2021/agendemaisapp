import colors from '@/assets/colors';
import { Button } from '@rneui/themed';
import React from 'react';
import { StyleSheet, View } from 'react-native';

// import { Container } from './styles';

const ButtonComponent: React.FC = () => {
  return (
    <Button
    color={colors.primary}
    buttonStyle={styles.buttonStyle}
    >
        Salvar
    </Button>
  )
}
const styles = StyleSheet.create({
    buttonStyle:{
        borderRadius:8,
        paddingVertical:10
    }
})
export default ButtonComponent;