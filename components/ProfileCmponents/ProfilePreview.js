import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../Global/Branding/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfilePreviewScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const [isFollowing, setIsFollowing] = useState(item.already_followed);
  const [isLiked, setIsLiked] = useState(item.already_liked);

  const handleFollow = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      const formdata = new FormData();
      
      if (!isFollowing) {
        formdata.append("follower_id", userId);
        formdata.append("followed_id", item.id);
        
        const response = await fetch(
          "https://muslimdating.coderisehub.com/api/send_follow_request",
          {
            method: "POST",
            body: formdata,
          }
        );
        const result = await response.json();
        if (result.status === 200) {
          setIsFollowing(true);
          Alert.alert('Success', 'Successfully followed user');
        }
      } else {
        formdata.append("followed_id", item.id);
        
        const response = await fetch(
          "https://muslimdating.coderisehub.com/api/unfollow",
          {
            method: "POST",
            body: formdata,
          }
        );
        const result = await response.json();
        if (result.status === 200) {
          setIsFollowing(false);
          Alert.alert('Success', 'Successfully unfollowed user');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process follow request');
    }
  };

  const handleLike = async () => {
    console.log("22")
    try {
      const userId = await AsyncStorage.getItem('user_id');
      const formdata = new FormData();
      formdata.append("user_id", "2");
      formdata.append("liked_user_id", "1");

      const response = await fetch(
        "https://muslimdating.coderisehub.com/api/like_user",
        {
          method: "POST",
          body: formdata,
        }
      );
      const result = await response.json();
      if (result.status === 200) {
        setIsLiked(!isLiked);
        Alert.alert('Success', isLiked ? 'User unliked' : 'User liked');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process like request');
    }
  };

  const InfoChip = ({ label }) => (
    <View style={styles.infoChip}>
      <Text style={styles.chipText}>{label || "dummy"}</Text>
    </View>
  );

  return (
    <ImageBackground
      source={{ uri: `https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Gisele_Bundchen2.jpg/800px-Gisele_Bundchen2.jpg` }}
      style={styles.container}
    >
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.name}>{item.first_name}, {item.age}</Text>
            </View>

            <View style={styles.chipContainer}>
              <InfoChip label={item.martial_status} />
              <InfoChip label={item.gender} />
              <InfoChip label={item.profession} />
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.roundButton, isLiked && {backgroundColor:"red"}]}
                onPress={handleLike}
              >
                <Ionicons 
                  name={isLiked ? "heart" : "heart-outline"} 
                  size={24} 
                  color={isLiked ? "#fff" : Colors.FontColorI} 
                />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.roundButton}
                onPress={() => Alert.alert('Subscribe', 'Please purchase subscription to start chatting')}
              >
                <Ionicons name="chatbubble" size={24} color={Colors.FontColorI} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.roundButton, isFollowing && styles.activeButton]}
                onPress={handleFollow}
              >
                <Ionicons 
                  name={isFollowing ? "person-remove" : "person-add"} 
                  size={24} 
                  color={isFollowing ? "#fff" : Colors.FontColorI} 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.viewProfileButton}
              onPress={() => navigation.navigate('ProfileDetailsScreen', { item })}
            >
              <Text style={styles.viewProfileText}>View Profile</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    gap: 20,
  },
  header: {
    marginBottom: 10,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  infoChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: {
    color: '#fff',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  roundButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activeButton: {
    backgroundColor: Colors.PrimaryColor,
  },
  viewProfileButton: {
    backgroundColor: Colors.FontColorI,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  viewProfileText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfilePreviewScreen;