import React, { useState, useEffect } from 'react';
import { View, Text, FlatList ,Image,ScrollView, ImageBackground,TouchableHighlight, Pressable, TouchableOpacity } from 'react-native';
import GlobalStyles from '../../Global/Branding/GlobalStyles';
import Styles from './Styles';
import profMale from '../../assets/images/male.png'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Fontisto from 'react-native-vector-icons/Fontisto'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Colors from '../../Global/Branding/colors';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Header from '../../Global/components/Header';
import getAsyncuser from '../../Global/components/getAsyncUser';
// import { getUserData } from '../../Global/Calls/ApiCalls';

// import * as Linking from 'expo-linking';
const Profile = () => {
const focused=useIsFocused()
const navigation =  useNavigation()
const [user,setUser]=useState()
const iconColor = Colors.FontColorI
const [loading,setLoading] =useState(true)






        useEffect(()=>{
            async function getAsyncData(){
            
            const userData = await getAsyncuser()
            if(userData){
                // getUserDataRec(userData)
            }
            }
            getAsyncData()
              },[focused])











function navigationRester(title) {
  navigation.reset({
    index: 0,
    routes: [{ name: title }],
  });
}


  function openLinkning(name){
    Linking.openURL(`https://${name}.alphanitesofts.net`);

  }
  return (

    <View 
    style ={GlobalStyles.Container}
    >
      <Header 
      name={"Settings"}
      />
      <View style={{width:"95%"}}>

      <ScrollView
      contentContainerStyle={{alignItems:'center'}}
      showsVerticalScrollIndicator={false}
      
      >

<View style={Styles.CardWrapperTop}>
 

  <View
  style={{flexDirection:'row',alignItems:'center'}}
  >

<Image
source = {profMale}
style={{width:40,height:40,borderRadius:1000}}

/>
<View
style={{backgroundColor:"pink",borderRadius:1000,width:40,height:40}}
>

</View>

<Text
style={GlobalStyles.TitleText}

>
  {user?.name || "---"} 
</Text>
</View>
<TouchableHighlight
// onPress={()=> navigation.navigate("ProfileDetails", {userData:user})}

>

<Ionicons 
name='chevron-forward'
size={20}
color={Colors.FontColorI}
/>

</TouchableHighlight>


</View>


<View

style={Styles.CardWrapperALL}
>
<View style={Styles.CardWrapperBottom}>

<View
  style={{flexDirection:'row',alignItems:'center'}}
  >


<FontAwesome5 
name='lock'
size={18}
color={iconColor}
style={Styles.IconWrapper}
/>
<Text
style={GlobalStyles.textStyle}
>
  Change Password
</Text>
</View>
<TouchableHighlight
// onPress={()=> navigation.navigate("ChangePassword")}

>

<Ionicons 
name='chevron-forward'
size={20}
color={Colors.FontColorI}
/>
</TouchableHighlight>

</View>

<View style={Styles.CardWrapperBottom}>

<View
  style={{flexDirection:'row',alignItems:'center'}}
  >


<Fontisto
name='favorite'
color={iconColor}
size={20}
style={Styles.IconWrapper}

/>
<Text
style={GlobalStyles.textStyle}
>
  Payment:   
</Text>
</View>
<Text
style={[GlobalStyles.textStyle,{color:user?.kyc === "pending"? Colors.deposit:user?.kyc === "approved"?Colors.send:Colors.danger}]}
>
  {user?.kyc || "--"}
</Text>
</View>



</View>





<View
style={Styles.CardWrapperALL}
>



<Pressable 
// onPress={()=> navigation.navigate("HelpCenter")}
style={Styles.CardWrapperBottom}>

<View
  style={{flexDirection:'row',alignItems:'center'}}
  >


<FontAwesome5
name='headset'
color={Colors.FontColorI}
size={20}
style={Styles.IconWrapper}

/>
<Text
style={GlobalStyles.textStyle}
>
  Help Center
</Text>
</View>

<Ionicons 
name='chevron-forward'
size={20}
color={Colors.FontColorI}
/>

</Pressable>


<TouchableOpacity 
// onPress={()=> navigation.navigate("AboutUs")}

style={Styles.CardWrapperBottom}>

<View
  style={{flexDirection:'row',alignItems:'center'}}
  >


<MaterialIcons
name='privacy-tip'
color={Colors.FontColorI}
size={20}
style={Styles.IconWrapper}

/>
<Text
style={GlobalStyles.textStyle}
>
  About Us
</Text>
</View>

<Ionicons 
name='chevron-forward'
size={20}
color={Colors.FontColorI}
/>

</TouchableOpacity>

<TouchableOpacity 
onPress={()=> openLinkning("icate-delete-account")}

style={Styles.CardWrapperBottom}>

<View
  style={{flexDirection:'row',alignItems:'center'}}
  >


<MaterialIcons
name='privacy-tip'
color={Colors.FontColorI}
size={20}
style={Styles.IconWrapper}

/>
<Text
style={GlobalStyles.textStyle}
>
  Privacy Policy
</Text>
</View>

<Ionicons 
name='chevron-forward'
size={20}
color={Colors.FontColorI}
/>

</TouchableOpacity>



<TouchableOpacity 
onPress={()=> openLinkning("icate-delete-account")}
style={Styles.CardWrapperBottom}>

<View
  style={{flexDirection:'row',alignItems:'center'}}
  >

<MaterialIcons
name='privacy-tip'
color={Colors.FontColorI}
size={20}
style={Styles.IconWrapper}

/>
<Text
style={GlobalStyles.textStyle}
>
  Terms & Conditions
</Text>
</View>

<Ionicons 
name='chevron-forward'
size={20}
color={Colors.FontColorI}
/>

</TouchableOpacity>



</View>







<View
style={Styles.CardWrapperALL}
>



<TouchableOpacity 
onPress={()=> {
  navigation.navigate("Login")
  navigationRester("Login")
  AsyncStorage.clear()
}}
style={Styles.CardWrapperBottom}>

<View


  style={{flexDirection:'row',alignItems:'center'}}
  >


<Ionicons
name='log-out-outline'
color={Colors.danger}
size={22}
style={Styles.IconWrapper}
/>
<Text
style={[GlobalStyles.textStyle,{color:Colors.danger}]}
>
  Log Out 
</Text>
</View>

<Ionicons 
name='chevron-forward'
size={20}
color={'transparent'}
/>

</TouchableOpacity>



</View>

<View
style={Styles.CardWrapperALL}
>



<TouchableOpacity 
onPress={()=> openLinkning("icate-delete-account")}
style={Styles.CardWrapperBottom}>

<View
  style={{flexDirection:'row',alignItems:'center'}}
  >


<MaterialCommunityIcons
name='delete-empty'
color={Colors.danger}
size={20}
style={Styles.IconWrapper}

/>
<Text
style={[GlobalStyles.textStyle,{color:Colors.danger}]}
>
  Delete Account
</Text>
</View>

<Ionicons 
name='chevron-forward'
size={20}
color={'transparent'}
/>

</TouchableOpacity>



</View>

<Text
style={{color:Colors.FontColorII}}
>Version 1.0.0</Text>

<View style={{width:100,height:200}}>

</View>

</ScrollView>

</View>


   </View>
  );
};

export default Profile;
