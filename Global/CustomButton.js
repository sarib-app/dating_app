import React from 'react';
import { TouchableOpacity, Text, StyleSheet,Dimensions } from 'react-native';
import Colors from './Branding/colors';
import { WindowWidth } from './components/Dimensions';



const CustomButton = ({ title, onPress ,color}) => {
  return (
    <TouchableOpacity style={[styles.button,{backgroundColor:color? color:Colors.PrimaryColor}]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.PrimaryColor,
    paddingVertical: 12,
    // paddingHorizontal: 32,
    width:WindowWidth/1.2,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomButton;
