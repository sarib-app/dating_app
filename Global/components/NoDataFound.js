import React, { useEffect, useRef, useState } from "react";

import { Text, View } from "react-native";

import AnimatedLottieView from "lottie-react-native";
import Nodata from '../../assets/Animationn/Nodata.json'

function NodataFound(){
  



const animation = useRef()





    return(
 
<>

 <AnimatedLottieView 
 autoPlay
 loop={true}
 ref={animation}
 style={{
   width: 200,
   height: 200,
   alignSelf:'center',
   marginTop:150,
   backgroundColor: 'transparent',
 }}
 // Find more Lottie files at https://lottiefiles.com/featured
 source={Nodata}
 />

 <Text style={{fontSize:18,fontWeight:'bold'}}>
    No Data Found
 </Text>

 </>
    )
}
export default NodataFound
