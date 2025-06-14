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
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { baseUrl } from '../Global/Urls';
import OpenImageModal from '../ImageGallerySrc.js/OpenImageModal';

const { width } = Dimensions.get('window');
const PROFILE_IMAGE_SIZE = 100;

const ProfileDetailsScreen = () => {
  const navigation = useNavigation();
  const focused = useIsFocused();
  const [imageModalVisible, setImageModalVisible] = useState(false);
const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [token, setToken] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (focused) {
      initializeProfile();
    }
  }, [focused]);

  const initializeProfile = async () => {
    try {
      setIsLoading(true);
      const userString = await AsyncStorage.getItem('user');
      const tokenString = await AsyncStorage.getItem('token');
      
      if (userString && tokenString) {
        const parsedUser = JSON.parse(userString);
        setCurrentUserId(parsedUser.id);
        setToken(tokenString);
        await fetchMyProfile(parsedUser.id, tokenString);
      } else {
        Alert.alert('Error', 'User session not found. Please login again.');
        // Navigate to login screen
      }
    } catch (error) {
      console.error('Error initializing profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyProfile = async (userId, userToken) => {
    try {
      const response = await fetch(
        `${baseUrl}fetch_user_by_id/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.status === 200) {
        console.log("My profile data:", result);
        setProfileData(result.user);
      } else {
        throw new Error(result.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to fetch profile details');
      throw error;
    }
  };

  const DetailCard = ({ icon, title, value }) => (
    <View style={styles.detailCard}>
      <Ionicons name={icon} size={24} color={Colors.FontColorI} />
      <Text style={styles.detailCardTitle}>{title}</Text>
      <Text style={styles.detailCardValue}>{value || 'Not specified'}</Text>
    </View>
  );

  const renderMyGallery = () => {
    const maxImages = 6;
    const canAddMore = !profileData?.images || profileData.images.length < maxImages;
    
    if (!profileData?.images?.length) {
      return (
        <View style={styles.emptyGalleryContainer}>
          <Text style={styles.emptyGalleryText}>No photos added yet</Text>
          <TouchableOpacity 
            style={styles.addPhotoButton}
            onPress={() => navigation.navigate("ImageGalleryScreen")}
          >
            <Text style={styles.addPhotoText}>Add Photos</Text>
          </TouchableOpacity>
        </View>
      );
    }

   // Create gallery data with add button as first item if user can add more
   const galleryData = [];
  
   if (canAddMore) {
     galleryData.push({ type: 'add', id: 'add-button' });
   }
   
   // Add existing images
   profileData.images.forEach((image, index) => {
     galleryData.push({ 
       type: 'image', 
       ...image, 
       originalIndex: index 
     });
   });
 
   return (
     <View style={styles.galleryGrid}>
       <FlatList
         data={galleryData}
         numColumns={3}
         scrollEnabled={false}
         keyExtractor={(item) => item.id.toString()}
         renderItem={({ item, index }) => {
           if (item.type === 'add') {
             return (
               <TouchableOpacity 
                 style={styles.addImageCard}
                 onPress={() => navigation.navigate("ImageGalleryScreen")}
               >
                 <Ionicons name="add" size={30} color={Colors.FontColorI} />
                 <Text style={styles.addImageText}>Add Photo</Text>
               </TouchableOpacity>
             );
           }
           
           return (
             <TouchableOpacity 
               style={styles.galleryImageContainer}
               onPress={() => openImageViewer(item.originalIndex)}
             >
               <Image
                 source={{ uri: `https://muslimdating.coderisehub.com/${item.image_path}` }}
                 style={styles.galleryImage}
               />
               {item.is_profile_picture === 1 && (
                 <View style={styles.profileImageBadge}>
                   <Ionicons name="star" size={12} color="#fff" />
                 </View>
               )}
             </TouchableOpacity>
           );
         }}
       />
       
       {/* Photo count indicator */}
       <View style={styles.photoCountContainer}>
         <Text style={styles.photoCountText}>
           {profileData.images.length} of {maxImages} photos
         </Text>
       </View>
     </View>
   );
 };
 

 const openImageViewer = (imageIndex) => {
  setSelectedImageIndex(imageIndex);
  setImageModalVisible(true);
};

// Image viewer modal component
const renderImageViewerModal = () => {
  if (!profileData?.images?.length) return null;
  
  return (
 <OpenImageModal 
 imageModalVisible={imageModalVisible}
 setImageModalVisible={setImageModalVisible}
 profileData={profileData}
 setSelectedImageIndex={setSelectedImageIndex}
 selectedImageIndex={selectedImageIndex}
 OtherUSerImage={true}
 />
  );
};
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.FontColorI} />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load profile</Text>
        <TouchableOpacity style={styles.retryButton} onPress={initializeProfile}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <ImageBackground
          source={{ 
            uri: profileData?.images?.[0]?.image_path 
              ? `https://muslimdating.coderisehub.com/${profileData.images[0].image_path}` 
              : 'https://via.placeholder.com/400x250?text=No+Image'
          }}
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
            
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => navigation.navigate("EditProfile")}
            >
              <Ionicons name="create-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.profileContainer}>
          <Image
            source={{ 
              uri: profileData?.images?.[0]?.image_path 
                ? `https://muslimdating.coderisehub.com/${profileData.images[0].image_path}` 
                : 'https://via.placeholder.com/100x100?text=No+Image'
            }}
            style={styles.profileImage}
          />
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profileData?.followers_count || 0}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.profileNameContainer}>
              <Text style={styles.profileName}>{profileData?.profile?.first_name || 'Unknown'}</Text>
              <Text style={styles.profileAge}>{profileData?.profile?.age || 'Age not set'} years</Text>
              {profileData?.profile?.profile_visibility === 'private' && (
                <View style={styles.privateTag}>
                  <Ionicons name="lock-closed" size={12} color="#fff" />
                  <Text style={styles.privateTagText}>Private</Text>
                </View>
              )}
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profileData?.following_count || 0}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          {/* My Profile Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.editProfileButton}
              onPress={() => navigation.navigate("EditProfileScreen", { profileData })}
              >
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => navigation.navigate("Settings")}
            >
              <Ionicons name="settings-outline" size={24} color={Colors.FontColorI} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => navigation.navigate("ProfileStats")}
            >
              <Ionicons name="analytics-outline" size={24} color={Colors.FontColorI} />
            </TouchableOpacity>
          </View>

          {profileData?.profile?.bio && (
            <View style={styles.bioContainer}>
              <Text style={styles.bioText}>{profileData.profile.bio}</Text>
            </View>
          )}

          <View style={styles.detailsGrid}>
            <DetailCard icon="location" title="Location" value={profileData?.profile?.location} />
            <DetailCard icon="school" title="Education" value={profileData?.profile?.education} />
            <DetailCard icon="briefcase" title="Profession" value={profileData?.profile?.profession} />
            <DetailCard icon="people" title="Ethnicity" value={profileData?.profile?.ethnicity} />
            <DetailCard icon="heart" title="Status" value={profileData?.profile?.martial_status} />
            <DetailCard icon="people-outline" title="Children" value={profileData?.profile?.children} />
            <DetailCard icon="moon" title="Religion" value={profileData?.profile?.religion} />
            <DetailCard icon="star" title="Sector" value={profileData?.profile?.religious_sector} />
            <DetailCard icon="happy" title="Personality" value={profileData?.profile?.personality} />
          </View>

          {profileData?.profile?.interests && (
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
              My Gallery
            </Text>
            {renderMyGallery()}
          </View>
        </View>
      </ScrollView>
      {renderImageViewerModal()}
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.FontColorII,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: Colors.FontColorII,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.FontColorI,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerBackground: {
    height: 250,
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
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
  editButton: {
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
  editProfileButton: {
    backgroundColor: Colors.FontColorI,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  editProfileButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  iconButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
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
  galleryImageContainer: {
    margin: 2,
  },
  galleryImage: {
    width: (width - 40) / 3 - 4,
    height: (width - 40) / 3 - 4,
    borderRadius: 8,
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
    marginBottom: 15,
  },
  addPhotoButton: {
    backgroundColor: Colors.FontColorI,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addPhotoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProfileDetailsScreen;

// export default ProfileDetailsScreen