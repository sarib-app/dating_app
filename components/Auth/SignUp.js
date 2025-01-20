import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import InputField from '../../Global/components/InputField';
import CustomButton from '../../Global/CustomButton';
import AuthStyles from './AuthStyles';
import GlobalStyles from '../../Global/Branding/GlobalStyles';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../Global/Branding/colors';
import { RegisterCall, registerUser } from '../../Global/Calls/ApiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingModal from '../../Global/components/LoadingModal';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isPressed, setIspressed] = useState(false);

  const [loading, setLoading] = useState(false);






  async function handleRegister(){
    // navigation.navigate("BottomNavigation")
    if(phone && password && email && name){
      Register_Call()
    }else{
      setIspressed(((p)=>!p))
    }
  }
  
  async function Register_Call(){

    const userData = {
      email: "Darrick.Howell46@gmail.com",
      firstName: "Einar",
      phoneNo: "772-234-0931",
      password: "1234567",
      passwordConfirmation: "1234567",
      baseUrl: "https://your-api-base-url.com", // Replace with your actual base URL
    };
  
    try {
      const result = await registerUser(userData);
      console.log("Registration Successful:", result);
    } catch (error) {
      console.error("Registration Failed:", error);
      Alert.alert("Error","Someting Went Wrong!")
    }
    finally{
    setLoading(false)
  }
  }






  return (
    <View style={GlobalStyles.Container}>
    <View style={AuthStyles.TitleWraper}>
        <Ionicons name="chevron-back-outline" size={28} color={ Colors.FontColorI} />
      <Text style={AuthStyles.title}>Welocome</Text>
      <Text style={AuthStyles.titleTwo}>Sign Up To Continue</Text>
     

      </View>
      <InputField
        icon="mail-outline"
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        pressed={isPressed}
      />
      <InputField
        icon="call-outline"
        placeholder="Phone"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        pressed={isPressed}
      />
      <InputField
        icon="person-outline"
        placeholder="Name"
        value={name}
        onChangeText={setName}
        pressed={isPressed}
      />
      <InputField
        icon="lock-closed-outline"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        pressed={isPressed}
      />
      <CustomButton title="Sign Up" onPress={() => { handleRegister() }} />
      <Text style={AuthStyles.signupText} onPress={() => navigation.navigate('Login')}>
        Already have an account? Login
      </Text>
      <LoadingModal 
      show={loading}
      />
    </View>
  );
};



export default SignupScreen;
