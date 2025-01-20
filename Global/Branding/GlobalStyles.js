import {
    StyleSheet,
   Dimensions
  } from 'react-native'
// import { Divider } from 'react-native-paper';
import Colors from './colors';
const WindowWidth = Dimensions.get('screen').width
  const WindowHeight = Dimensions.get('window').height; 
  const GlobalStyles = StyleSheet.create({ 
Container:{
    width:WindowWidth,
    height:WindowHeight,
    backgroundColor:Colors.BgColor,
    
    alignItems:'center'
},
Header:{
    width:WindowWidth,
    height:WindowHeight/13,
    // paddingBottom:-20,
    backgroundColor:Colors.BgColor,
    alignItems:'center',
    // flexDirection:'row',
    justifyContent:'flex-end',
    // justifyContent:'center'
},

RowMaker:{
flexDirection:'row',
alignItems:'center'
},

SmallBtn:{
 
  padding:20,
  backgroundColor:Colors.PrimaryColor,
  alignItems:'center',
  justifyContent:'center',
  paddingTop:10,
  paddingBottom:10,
  margin:10,
  borderRadius:10
},
HistoryCard:{
padding:20,
width:WindowWidth/1.05,
backgroundColor:Colors.Dark,
borderRadius:20,
marginTop:20
// alignItems:'flex-start'
},
ColumnAligner:{alignItems:'center',marginLeft:10},

Goback:{
fontSize:18,
color:Colors.PrimaryColor,
fontWeight:'bold',
textDecorationLine:'underline',
},
HeaderText:{
    color:Colors.FontColorI,
    fontSize:18,
    fontWeight:'bold',
    // marginLeft:10
},
BtnText:{
  color:Colors.FontColorI,
  fontSize:18,
  fontWeight:'bold'
},
TextInput:{
  width:WindowWidth/1.2,
  height:WindowHeight/15,
  borderRadius:10,
  borderColor:Colors.PrimaryColor,
  borderWidth:1,
  backgroundColor:Colors.bgIII
},

TitleText:{
  color:Colors.FontColorI,
  fontWeight:'600',
  fontSize:18,
  marginLeft:15
 },

 textStyle:{
  color:Colors.FontColorI,
  fontWeight:'500',
  fontSize:14,
  // marginLeft:15
 },




  })
  export default GlobalStyles