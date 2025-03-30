import colors from "@/assets/colors";
import { useRouter } from "expo-router";

import React, { useRef ,useState} from "react";
import {
  Dimensions,
  Image,
  ImageProps,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";

const Introduction: React.FC = () => {
    const sliderRef = useRef<AppIntroSlider>(null)
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const router = useRouter()
  const slides = [
    {
      key: 1,
      title: "Bem vindo ao Agende+ para Estabelecimentos!",
      text: "Sua gestão de agendamentos de forma fácil e rápida.",
      image: require("@/assets/images/loja.png"),
    },
    {
      key: 2,
      title: "Gerencie seus agendamentos em um único lugar.",
      text: "Controle completo de serviços e clientes em tempo real.",
      image: require("@/assets/images/agendamento.png"),
    },
    {
      key: 3,
      title:
        "Cadastre seu estabelecimento e comece a receber agendamentos hoje mesmo!",
      text: "Adicione seus serviços  para começar a operar.",
      image: require("@/assets/images/formulario.png"),
    },
  ];

  const _renderItem = ({
    item,
  }: {
    item: {
      key: number;
      title: string;
      text: string;
      image: ImageProps;
    };
  }) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} />
        <View style={styles.containerText}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      </View>
    );
  };
  const _renderNextButton = () => {
    return (
      <TouchableOpacity style={styles.nextButton} onPress={goToNextSlide}>
        <Text style={styles.textButton}>Próximo</Text>
      </TouchableOpacity>
    );
  };
  const _renderDoneButton = () => {
    return (
        <TouchableOpacity style={styles.nextButton} onPress={()=> router.replace('/initial')}>
        <Text style={styles.textButton}>Confirmar</Text>
      </TouchableOpacity>
    );
  };

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex < slides.length) {
      setCurrentSlideIndex(nextSlideIndex); // Atualiza o índice
      sliderRef.current?.goToSlide(nextSlideIndex); // Avança para o próximo slide
    }
  };

  return (
    <View style={styles.container}>
      <AppIntroSlider
        renderItem={_renderItem}
        data={slides}
        renderNextButton={_renderNextButton}
        bottomButton
        renderDoneButton={_renderDoneButton}
        activeDotStyle={styles.activeDotStyle}
        showSkipButton
        showPrevButton
        ref={sliderRef}
        onSlideChange={(index) => setCurrentSlideIndex(index)}
      />
      <TouchableOpacity style={styles.skip} onPress={()=> router.replace('/initial')}>
        <Text style={styles.textSkip}>Pular</Text>
      </TouchableOpacity>
    </View>
  );
};
const height = Dimensions.get('screen').height
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(174, 0, 255, 0.2)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: colors.primary,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 8,
  },
  textButton: {
    color: "white",
    fontFamily:'Poppins-Regular'
  },
  slide: {
    backgroundColor: "white",
    height:height,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: colors.dark,
    fontSize: 20,
    textAlign: "center",
     fontFamily:'Poppins-Bold'
  },
  text: {
    color: colors.gray,
    fontSize: 16,
    textAlign: "center",
     fontFamily:'Poppins-Regular'
  },
  image: {
    width: 200,
    height: 200,
    objectFit: "contain",
  },
  containerText: {
    alignItems: "center",
    justifyContent: "center",
  },
  activeDotStyle: {
    backgroundColor: colors.primary,
  },
  skip:{
    position:'absolute',
    bottom:30,
    right:30
  },
  textSkip:{
    color:colors.primary,
     fontFamily:'Poppins-Regular'
  }
});

export default Introduction;
