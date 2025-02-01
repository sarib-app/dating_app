import {
    StyleSheet,
   Dimensions
  } from 'react-native'
// import { Divider } from 'react-native-paper';
import Colors from '../../Global/Branding/colors';
const WindowWidth = Dimensions.get('screen').width
  const WindowHeight = Dimensions.get('screen').height; 
  const NotifiactionStyles = StyleSheet.create({ 
Card:{
    width:WindowWidth/1.05,
    // height:WindowHeight/7,
    backgroundColor:Colors.Dark,
    borderRadius:10,
    elevation:10,
    shadowColor:Colors.Dark,
    padding:20,
    marginTop:10
},
CardTitle:{
    fontWeight:'bold',
    fontSize:16,
    color:Colors.FontColorI
},
CardDesc:{
    fontWeight:'400',
    fontSize:14,
    color:Colors.FontColorI,
    width:"40%"
},
TopLoanCard:{
  width:WindowWidth/1.05,
//   height:WindowHeight/3.7,
  padding:20,
  marginTop:20,
  borderRadius:20,
  backgroundColor:Colors.Dark
},
TopCardTitle:{ fontSize: 20, fontWeight: 'bold', color: Colors.FontColorI },
TopIconWrapper:{padding:12,backgroundColor:Colors.bgIv,borderRadius:5,justifyContent:'center',alignItems:'center'},

ApplyButton:{
  width:100,
  height:50,
  borderWidth:1,
  borderColor:Colors.PrimaryColor,
  backgroundColor:Colors.PrimaryColor,
  borderRadius:10,
  alignItems:'center',
  justifyContent:'center',
  alignSelf:'center',
//   margin:20
},
ApplyButtonSmall:{
  // width:100,
  // height:50,
  paddingVertical:7,
  paddingHorizontal:15,
// width:90,
  backgroundColor:Colors.deposit,
  borderWidth:1,
  borderColor:Colors.BgColor,
  borderRadius:8,
  alignItems:'center',
  justifyContent:'center',
  alignSelf:'center',
  // margin:20
}


  })
  export default NotifiactionStyles