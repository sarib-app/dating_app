import {
  StyleSheet,
 Dimensions
} from 'react-native'
// import { Divider } from 'react-native-paper';

import Colors from '../../Global/Branding/colors';
const WindowWidth = Dimensions.get('screen').width
const WindowHeight = Dimensions.get('screen').height; 
const Styles = StyleSheet.create({ 

  CardWrapperTop:{
    width:WindowWidth/1.05,
    padding:17,
    borderRadius:8,
    flexDirection:'row',
    justifyContent:'space-between',
    backgroundColor:Colors.Dark,
    shadowColor:Colors.Dark,
    elevation:2,
    margin:10,
    alignItems:'center'
  },
  CardWrapperALL:{
    width:WindowWidth/1.05,
    // paddingTop:17,
    paddingBottom:10,
    borderRadius:8,
    backgroundColor:Colors.Dark,
    shadowColor:Colors.Dark,
    elevation:2,
    alignItems:"center",
    margin:5

  
  },
  CardWrapperBottom:{
    width:WindowWidth/1.15,
    // padding:17,
    // backgroundColor:"yellow",
    paddingTop:19,
    paddingBottom:19,
    borderRadius:8,
    flexDirection:'row',
    justifyContent:'space-between',
    // margin:20,
    alignItems:'center'
  },
  CardWrapperTextInput:{
    width:WindowWidth/1.15,
    // padding:17,
    // backgroundColor:"yellow",
    paddingTop:12,
    paddingBottom:12,
    borderRadius:8,
    flexDirection:'row',
    justifyContent:'space-between',
    // margin:20,
    alignItems:'center'
  },
  IconWrapper:{width:23},
  SectionTitle:{
    color:Colors.FontColorII,
    alignSelf:'flex-start',
    marginLeft:15,
    fontSize:16,
    fontWeight:'600'
  }


})
export default Styles