import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../Global/Branding/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { likeUser, followUser, unfollowUser } from '../../Global/Calls/UserActions';
import { likeUser,followUser, unfollowUser } from '../../Global/Calls/ApiCalls';
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('window');
const PROFILE_IMAGE_SIZE = 100;

const ProfileDetailsScreen = ({ route }) => {
    const navigation = useNavigation()
  const { user } = route?.params ?route.user : "null"
  const [currentUserId, setCurrentUserId] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
    getCurrentUserId();
  }, []);

  const getCurrentUserId = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    setCurrentUserId(userId);
  };

  const fetchUserProfile = async () => {
    try {
    //   const token = await AsyncStorage.getItem('token');

    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL211c2xpbWRhdGluZy5jb2RlcmlzZWh1Yi5jb20vYXBpL2xvZ2luX3VzZXIiLCJpYXQiOjE3Mzc5MjA1NTUsImV4cCI6MTczNzkyNDE1NSwibmJmIjoxNzM3OTIwNTU1LCJqdGkiOiJtSnhQbjZ6SWptWUJPZWowIiwic3ViIjoiMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.y-zpIt4BukwrTbZ5uAVDePyRcJb9SnwcjgW3qvk3nKg"
      const response = await fetch(
        `https://muslimdating.coderisehub.com/api/fetch_user_by_id/2`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (result.status === 200) {
        setProfileData(result.user);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch profile details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      let response;
      if (profileData?.profile.already_followed) {
        response = await unfollowUser(profileData.profile.user_id);
      } else {
        response = await followUser(profileData.profile.user_id);
      }
      
      if (response.status === 200) {
        setProfileData(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            already_followed: !prev.profile.already_followed,
            follow_request_status: !prev.profile.already_followed ? 'pending' : null
          }
        }));
        Alert.alert('Success', response.message || 'Action completed successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process follow action');
    }
  };

  const handleLike = async () => {
    try {
      const response = await likeUser(profileData.profile.user_id);
      if (response.status === 200) {
        setProfileData(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            already_liked: !prev.profile.already_liked
          }
        }));
        Alert.alert('Success', response.message || 'Profile liked successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process like action');
    }
  };

  const getFollowButtonText = () => {
    if (profileData?.profile.already_followed) {
      return 'Following';
    }
    if (profileData?.profile.follow_request_status === 'pending') {
      return 'Requested';
    }
    return 'Follow';
  };

  const DetailCard = ({ icon, title, value }) => (
    <View style={styles.detailCard}>
      <Ionicons name={icon} size={24} color={Colors.FontColorI} />
      <Text style={styles.detailCardTitle}>{title}</Text>
      <Text style={styles.detailCardValue}>{value}</Text>
    </View>
  );

  const renderGallery = () => {
    if (!profileData?.profile.already_followed && profileData?.profile.profile_visibility === 'private') {
      return (
        <View style={styles.privateGalleryContainer}>
          <Ionicons name="lock-closed" size={50} color={Colors.FontColorII} />
          <Text style={styles.privateGalleryText}>This account is private</Text>
          <Text style={styles.privateGallerySubtext}>Follow to see their photos</Text>
        </View>
      );
    }

    if (!profileData?.images?.length) {
      return (
        <View style={styles.emptyGalleryContainer}>
          <Text style={styles.emptyGalleryText}>Gallery not updated yet</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={profileData.images}
        numColumns={3}
        scrollEnabled={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: `https://muslimdating.coderisehub.com/${item.image_path}` }}
            style={styles.galleryImage}
          />
        )}
      />
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.FontColorI} />
      </View>
    );
  }

  const isOwnProfile = currentUserId === profileData?.profile.user_id.toString();

  return (
    <View style={styles.container}>
      <ScrollView>
        <ImageBackground
          source={{ uri: `https://muslimdating.coderisehub.com/${profileData?.images[0]?.image_path}` }}
          style={styles.headerBackground}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.headerGradient}
          >
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.profileContainer}>
          <Image
            source={{ uri: `https://muslimdating.coderisehub.com/${profileData?.images[0]?.image_path}` }}
            style={styles.profileImage}
          />
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>245</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.profileNameContainer}>
              <Text style={styles.profileName}>{profileData?.profile.first_name}</Text>
              <Text style={styles.profileAge}>{profileData?.profile.age} years</Text>
              {profileData?.profile.profile_visibility === 'private' && (
                <View style={styles.privateTag}>
                  <Ionicons name="lock-closed" size={12} color="#fff" />
                  <Text style={styles.privateTagText}>Private</Text>
                </View>
              )}
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          {!isOwnProfile && (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.followButton, profileData?.profile.already_followed && styles.followingButton]}
                onPress={handleFollow}
              >
                <Text style={[
                  styles.followButtonText,
                  profileData?.profile.already_followed && styles.followingButtonText
                ]}>
                  {getFollowButtonText()}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => Alert.alert('Subscribe', 'Please purchase subscription to start chatting')}
              >
                <Ionicons name="chatbubble-outline" size={24} color={Colors.FontColorI} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.iconButton, profileData?.profile.already_liked && styles.likedButton]}
                onPress={handleLike}
              >
                <Ionicons 
                  name={profileData?.profile.already_liked ? "heart" : "heart-outline"}
                  size={24} 
                  color={profileData?.profile.already_liked ? "#fff" : Colors.FontColorI}
                />
              </TouchableOpacity>
            </View>
          )}

          {profileData?.profile.bio && (
            <View style={styles.bioContainer}>
              <Text style={styles.bioText}>{profileData.profile.bio}</Text>
            </View>
          )}

          <View style={styles.detailsGrid}>
            <DetailCard icon="location" title="Location" value={profileData?.profile.location} />
            <DetailCard icon="school" title="Education" value={profileData?.profile.education} />
            <DetailCard icon="briefcase" title="Profession" value={profileData?.profile.profession} />
            <DetailCard icon="people" title="Ethnicity" value={profileData?.profile.ethnicity} />
            <DetailCard icon="heart" title="Status" value={profileData?.profile.martial_status} />
            <DetailCard icon="people-outline" title="Children" value={profileData?.profile.children} />
            <DetailCard icon="moon" title="Religion" value={profileData?.profile.religion} />
            <DetailCard icon="star" title="Sector" value={profileData?.profile.religious_sector} />
            <DetailCard icon="happy" title="Personality" value={profileData?.profile.personality} />
          </View>

          {profileData?.profile.interests && (
            <View style={styles.interestsContainer}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="heart" size={24} color={Colors.FontColorI} style={styles.sectionIcon} />
                Interests
              </Text>
              <View style={styles.interestTags}>
                {profileData.profile.interests.split(',').map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <Text style={styles.interestText}>{interest.trim()}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.galleryContainer}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="images" size={24} color={Colors.FontColorI} style={styles.sectionIcon} />
              Gallery
            </Text>
            {renderGallery()}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerBackground: {
    height: 250,
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    marginTop: -50,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  profileImage: {
    width: PROFILE_IMAGE_SIZE,
    height: PROFILE_IMAGE_SIZE,
    borderRadius: PROFILE_IMAGE_SIZE / 2,
    marginTop: -50,
    alignSelf: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.FontColorI,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.FontColorII,
  },
  profileNameContainer: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.FontColorI,
  },
  profileAge: {
    fontSize: 16,
    color: Colors.FontColorII,
    marginTop: 2,
  },
  privateTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.FontColorI,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 5,
  },
  privateTagText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 10,
  },
  followButton: {
    backgroundColor: Colors.FontColorI,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: '#F0F0F0',
  },
  followButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  followingButtonText: {
    color: Colors.FontColorI,
  },
  iconButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likedButton: {
    backgroundColor: Colors.FontColorI,
  },
  bioContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
  },
  bioText: {
    fontSize: 16,
    color: Colors.FontColorII,
    lineHeight: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  detailCard: {
    width: '31%',
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  detailCardTitle: {
    fontSize: 12,
    color: Colors.FontColorII,
    marginTop: 5,
  },
  detailCardValue: {
    fontSize: 14,
    color: Colors.FontColorI,
    fontWeight: '500',
    marginTop: 3,
    textAlign: 'center',
  },
  interestsContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.FontColorI,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 10,
  },
  interestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestTag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  interestText: {
    color: Colors.FontColorI,
    fontSize: 14,
  },
  galleryContainer: {
    marginTop: 20,
  },
  galleryImage: {
    width: (width - 40) / 3 - 4,
    height: (width - 40) / 3 - 4,
    margin: 2,
    borderRadius: 8,
  },
  privateGalleryContainer: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
  },
  privateGalleryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.FontColorI,
    marginTop: 15,
  },
  privateGallerySubtext: {
    fontSize: 14,
    color: Colors.FontColorII,
    marginTop: 5,
  },
  emptyGalleryContainer: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
  },
  emptyGalleryText: {
    fontSize: 16,
    color: Colors.FontColorII,
  }
});

export default ProfileDetailsScreen