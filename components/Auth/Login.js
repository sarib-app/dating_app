import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Image } from 'react-native';
import InputField from '../../Global/components/InputField';
import CustomButton from '../../Global/CustomButton';
import GlobalStyles from '../../Global/Branding/GlobalStyles';
import Colors from '../../Global/Branding/colors';
import InputTitle from '../../Global/components/InputTitle';
import { Ionicons } from '@expo/vector-icons';
import AuthStyles from './AuthStyles';
import {  loginUser } from '../../Global/Calls/ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingModal from '../../Global/components/LoadingModal';
import Ellipse from "../../assets/images/Ellipse.png"
import EllipseII from "../../assets/images/EllipseII.png"
const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isPressed, setIspressed] = useState(false);
  const [loading, setLoading] = useState(false);


async function handleLogin(){
  // navigation.navigate("BottomNavigation")
  if(phone && password){
    LoginCall()
  }else{
    
    setIspressed(((p)=>!p))
  }
}

async function LoginCall(){

  const credentials = {
    email: "Gerardo93@yahoo.com",
    password: "1234567",
    baseUrl: "https://your-api-base-url.com", // Replace with your actual base URL
  };
  setLoading(true)

  try {
    const result = await loginUser(credentials);
    console.log("Login Successful:", result);

 
    if(result.status === "200"){
        AsyncStorage.setItem("user",JSON.stringify(result.user))
        AsyncStorage.setItem("token",result.token)
        navigation.navigate("BottomNavigation")
        setLoading(false)
    }
    else if(result.status === "401"){
        Alert.alert("Error",result.message)
        setLoading(false)
    }
    } catch (error) {
    console.error("Login Failed:", error);
    Alert.alert("Error","Someting Went Wrong!")

  }
  finally{
    setLoading(false)
  }
}







  return (
    <View style={GlobalStyles.Container}>
      <View style={AuthStyles.TitleWraper}>
        <Ionicons name="chevron-back-outline" size={28} color={Colors.FontColorI} />
      <Text style={AuthStyles.title}>Welocome</Text>
      <Text style={AuthStyles.titleTwo}>Login To Continue</Text>
  

      </View>
      <InputTitle 
      value={"Phone"}
      />
      <InputField
        icon="call-outline"
        placeholder="Phone"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        pressed={isPressed}
      />
         <InputTitle 
      value={"Enter Password"}
      />
      <InputField
        icon="lock-closed-outline"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}        
        pressed={isPressed}

      />
      <CustomButton title="Login" onPress={() => {handleLogin()}} />
      <Image
source={EllipseII}
style={{width:54,height:57,marginTop:180,alignSelf:'flex-start',marginLeft:20,  opacity:0.8}}
/>

<Image
source={EllipseII}
style={{width:54,height:57,alignSelf:'flex-start',opacity:1,position:'absolute',top:70,right:30,transform: [
  { rotate: '180deg' },
  { scale: 1.5 },
]}}
/>
      <Text style={AuthStyles.signupText} onPress={() => navigation.navigate('Signup')}>
        Don't have an account? Sign up
      </Text>
      <LoadingModal 
      show={loading}
      />


    </View>
  );
};


export default LoginScreen;
