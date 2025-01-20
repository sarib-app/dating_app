


import React from 'react';
import {
  SafeAreaView,
  Text,
  Modal,
  View
  
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import GlobalStyles from '../GlobalStyles/GlobalStyles';


function CustomAlert ({title,isVisible,message}){
const navigation = useNavigation()
  return (
    <Modal
    transparent={true}
    visible={isVisible}
    animationType='slide'
    
    >

    <SafeAreaView style={[GlobalStyles.Container,{backgroundColor:"rgba(0,0,0,0.5)",justifyContent:"center"}]}>
    <View
     style={GlobalStyles.SmallBtn}
    >
    
<Text
style={GlobalStyles.BtnText}
>
    {title}
</Text>
<Text
style={GlobalStyles.BtnText}
>
{message}
</Text>
</View>

    </SafeAreaView>
    </Modal>
  
  );
};



export default CustomAlert;
