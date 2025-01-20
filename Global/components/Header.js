

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  View
  
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import GlobalStyles from '../Branding/GlobalStyles';
import { useIsFocused } from '@react-navigation/native';
import Colors from '../Branding/colors';
// import YtSearchSuggestions from '../Search/YtSearchSuggestions';
function Header ({name,TxtColor,color}){
const navigation = useNavigation()
const focused = useIsFocused()

  return (
    <View style={[GlobalStyles.Header,{backgroundColor:color?color:Colors.BgColor}]}>
     
  
<Text
style={[GlobalStyles.HeaderText,{color:TxtColor?TxtColor:Colors.FontColorI}]}
>
  {name}
</Text>
      



     


    </View>
  );
};



export default Header;
