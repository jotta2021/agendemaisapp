import React from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native'

const LoadingComponent = () => {
  return (
    <View style={{alignItems:'center',justifyContent:'center'}}> 
        <LottieView
        source={require('../../assets/loading.json')}
        autoPlay
        loop
        style={{width:200,height:200}}
        />
    </View>
  )
}

export default LoadingComponent;