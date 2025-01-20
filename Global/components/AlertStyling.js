import {
    StyleSheet,
  
    Dimensions,
    
  } from 'react-native';
  
  const WindowWidth = Dimensions.get('window').width
  const WindowHeight = Dimensions.get('screen').height; 
  
import Colors from '../Branding/colors';  
  const AlertStyles = StyleSheet.create({
      Container:{
          width:WindowWidth,
          height:WindowHeight,
          alignItems:'center',
          backgroundColor:"rgba(0,0,0,0.4)",justifyContent:'center'
      },
      AlertBox:{
        width:WindowWidth/1.2,
        height:WindowHeight/5,
        borderRadius:20,
        backgroundColor:Colors.Dark,
        alignItems:'center',
        padding:10,
        justifyContent:'center'
      },
      Button:{
      padding:10,
      paddingLeft:20,
      paddingRight:20,
      borderRadius:10,
      backgroundColor:Colors.PrimaryColor,
       
      },
      BtnTxt:{
        color:Colors.Dark,
        fontWeight:'bold'
      },
      AlertTxt:{
        color:Colors.FontColorI,
        margin:10,
        textAlign:'center'
      },
      AlertTitle:{
        color:Colors.FontColorI,
        fontWeight:'bold',
        fontSize:16
      }
   
  
      });
   export default AlertStyles   