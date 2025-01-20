import React, { useRef } from "react";
import AnimatedLottieView from "lottie-react-native";
import loaderAnimation from '../../assets/Animationn/Loader.json'
import { View,Modal, TouchableOpacity ,Text} from "react-native";
import GlobalStyles from "../Branding/GlobalStyles";
import Colors from "../Branding/colors";

function InitialLoading({show}){
    const animation = useRef()

    return(
      
        <View style={[GlobalStyles.Container,{backgroundColor:Colors.BgColor,justifyContent:'center'}]}> 
        {/* <Header/> */}
        <AnimatedLottieView 
        autoPlay
        loop={true}
        ref={animation}
        style={{
          width: 200,
          height: 200,
          alignSelf:'center',
          marginTop:-20,
          backgroundColor: 'transparent',
        }}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={loaderAnimation}
        />



        </View>

    


    )
}
export default InitialLoading