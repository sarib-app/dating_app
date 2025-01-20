

import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  View
  
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import GlobalStyles from '../Branding/GlobalStyles';

import Ionicons from 'react-native-vector-icons/Ionicons'

import Colors from '../Branding/colors';
// import YtSearchSuggestions from '../Search/YtSearchSuggestions';

function HeaderScreens ({ScreenName}){
const navigation = useNavigation()

  return (
    <SafeAreaView style={GlobalStyles.Header}>
      <View
      style={{
      alignItems:'center',
      flexDirection:'row',
      marginLeft:10

    
  }}
      >
      <Ionicons 
      onPress={()=> navigation.goBack()}
        name='arrow-back'
                    size={21}
        color={ Colors.FontColorI}

        /> 
<Text
style={GlobalStyles.HeaderText}
>
  {ScreenName}
</Text>
      </View>



   
    </SafeAreaView>
  );
};



export default HeaderScreens;
