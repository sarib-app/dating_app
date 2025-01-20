import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../Branding/colors';

const InputTitle = ({ value,style }) => {
  return (
    <Text style={[styles.TxtStyle,style ? style :{}]}>
      {value}
    </Text>
  );
};

const styles = StyleSheet.create({
TxtStyle:{
  color:Colors.FontColorI,
  fontWeight:'bold',
  fontSize:14,
  alignSelf:'flex-start',
  marginLeft:10
}
});

export default InputTitle;
