import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../Auth/Login';
import SignupScreen from '../Auth/SignUp';

import MockUpScreen from '../MockUp/MockUpScreen';
import CompleteProfileScreen from '../ProfileCmponents/CompleteScreen';
import PreferencesScreen from '../PreferencesComp/AddPreferences';
import BottomNavigation from '../BottomNavigation/BottomNavigation';
import ProfilePreviewScreen from '../ProfileCmponents/ProfilePreview';
import ProfileDetailsScreen from '../ProfileCmponents/ProfileDetails';
import Profile from '../Porfile/Porfile';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CompleteProfileScreen" component={CompleteProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MockUpScreen" component={MockUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PreferencesScreen" component={PreferencesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BottomNavigation" component={BottomNavigation} options={{ headerShown: false }} />
        <Stack.Screen name="ProfilePreviewScreen" component={ProfilePreviewScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileDetailsScreen" component={ProfileDetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileSrc" component={Profile} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthStack;
