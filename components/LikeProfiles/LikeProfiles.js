import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  Alert,
  ImageBackground,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../Global/Branding/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { baseUrl } from '../Global/Urls';

const { width } = Dimensions.get('window');

const LikedProfilesScreen = () => {
  const focused = useIsFocused()
  const navigation = useNavigation();
  const [likedProfiles, setLikedProfiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLikedProfiles();
  }, [focused]);

  const fetchLikedProfiles = async () => {
    // setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const user = await AsyncStorage.getItem('user');
      const parsedUSer = JSON.parse(user)
      if(!parsedUSer){
        return
      }
 
      const formdata = new FormData();
      formdata.append("user_id",parsedUSer.id)

      const response = await fetch(
        `${baseUrl}get_liked_profiles`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formdata,
        }
      );
      const result = await response.json();
      if (result.status === 200) { 
        setLikedProfiles(result.liked_profiles);
      }
      else{
        Alert.alert("Error", result.message || result.error)
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch liked profiles');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderMatchItem = ({ item }) => (
    <ImageBackground 
      source={{ uri: `https://muslimdating.coderisehub.com/${item.images[0]?.image_path}` }}
      style={styles.matchCard}
      imageStyle={styles.matchImage}
    >
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      >
        <View style={styles.matchInfo}>
          <View style={styles.userInfoContainer}>
            <Text style={styles.matchName}>{item.first_name}, {item.age}</Text>
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              onPress={() => Alert.alert('Subscribe', 'Please purchase subscription to start chatting')}
              style={styles.actionButton}
            >
              <Ionicons name="chatbubble-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => navigation.navigate('ProfilePreviewScreen', { item })}
              style={styles.actionButton}
            >
              <Ionicons name="eye-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={50} color={Colors.FontColorII} />
      <Text style={styles.emptyText}>No liked profiles yet</Text>
      <Text style={styles.emptySubText}>Start exploring to find your match!</Text>
      <TouchableOpacity 
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Explore')}
      >
        <Text style={styles.exploreButtonText}>Explore Profiles</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.FontColorI} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Liked Profiles</Text>
      </View>

      <FlatList
        data={likedProfiles}
        renderItem={renderMatchItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.matchesRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.matchesList}
        ListEmptyComponent={EmptyComponent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.FontColorI,
  },
  matchesRow: {
    justifyContent: 'space-between',
  },
  matchesList: {
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  matchCard: {
    width: (width - 50) / 2,
    height: 250,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  matchImage: {
    borderRadius: 10,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    justifyContent: 'flex-end',
  },
  matchInfo: {
    padding: 12,
  },
  userInfoContainer: {
    marginBottom: 8,
  },
  matchName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  actionButton: {
    padding: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.FontColorI,
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 16,
    color: Colors.FontColorII,
    marginTop: 10,
    marginBottom: 30,
  },
  exploreButton: {
    backgroundColor: Colors.FontColorI,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LikedProfilesScreen;