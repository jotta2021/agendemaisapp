import colors from '@/assets/colors';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';


const LoadingComponent = () => {
  return (
    <View style={{alignItems:'center',justifyContent:'center'}}> 
     <ActivityIndicator size="large" color={colors.primary} />
    </View>
  )
}

export default LoadingComponent;