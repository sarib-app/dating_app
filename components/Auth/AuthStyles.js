import {
    StyleSheet,
   Dimensions
  } from 'react-native'
// import { Divider } from 'react-native-paper';
import Colors from '../../Global/Branding/colors';
const WindowWidth = Dimensions.get('screen').width
  const WindowHeight = Dimensions.get('screen').height; 
  const AuthStyles = StyleSheet.create({ 


    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
      },
      TitleWraper:{alignSelf:'flex-start',marginTop:50,margin:10,marginBottom:50
    },
      title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.FontColorI,
        marginBottom: 10,
        marginTop:10
      },
      titleTwo: {
        fontSize: 16,
        fontWeight: '400',
        color: Colors.FontColorII,
        marginBottom: 0
      },
      signupText: {
        color: Colors.FontColorI,
        marginTop: 20,
        textDecorationLine: 'underline',
        position:'absolute',
        bottom:50
      },
      loginText: {
        color: '#6200EE',
        marginTop: 20,
        textDecorationLine: 'underline',
      },


  })
  export default AuthStyles