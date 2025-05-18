import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import Colors from '../../Global/Branding/colors';
import HomeScreen from '../Home/HomeScreen';
import ExploreScreen from '../Explore/Explore';
import ProfileDetailsScreen from '../ProfileCmponents/ProfileDetails';
import Profile from '../Porfile/Porfile';
import LikedProfilesScreen from '../LikeProfiles/LikeProfiles';

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown:false,
        tabBarStyle: {
            backgroundColor: Colors.Dark,
            borderTopWidth: 0,
          
          
          },
          
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Liked') {
            iconName = 'heart-outline';
          } else if (route.name === 'Explore') {
            iconName = 'search';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          }
          else if (route.name === 'Favorites') {
            iconName = 'heart-circle-outline';
          }
          else if (route.name === 'Settings') {
            iconName = 'settings';
          }


  return <Ionicons name={iconName} size={size} color={color} />;

        },
        tabBarActiveTintColor: Colors.PrimaryColor,
        tabBarInactiveTintColor: 'gray',
      })}
      
    >
      <Tab.Screen name="Liked" component={LikedProfilesScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Profile" component={ProfileDetailsScreen} />
      <Tab.Screen name="Settings" component={Profile} />


    </Tab.Navigator>
  );
};

export default BottomNavigation;
