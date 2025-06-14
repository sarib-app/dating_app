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
  Dimensions,
  ActivityIndicator,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../../Global/Branding/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { baseUrl } from '../Global/Urls';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 60) / 3;

const ImageGalleryScreen = () => {
  const navigation = useNavigation();
  const focused = useIsFocused();
  
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (focused) {
      initializeGallery();
    }
  }, [focused]);

  const initializeGallery = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        const parsedUser = JSON.parse(userString);
        setCurrentUserId(parsedUser.id);
        await fetchUserImages(parsedUser.id);
      }
    } catch (error) {
      console.error('Error initializing gallery:', error);
    }
  };

  const fetchUserImages = async (userId) => {
    try {
      setLoading(true);
      const formdata = new FormData();
      formdata.append("user_id", userId.toString());
      
      const response = await fetch(`${baseUrl}get_user_images`, {
        method: "POST",
        body: formdata,
      });
      
      const result = await response.json();
      
      if (result.status === "200" || result.status === 200) {
        // Sort images so profile picture comes first
        const sortedImages = result.data.sort((a, b) => b.is_profile_picture - a.is_profile_picture);
        setImages(sortedImages);
      } else {
        console.error('Failed to fetch images:', result.message);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      Alert.alert('Error', 'Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to upload images.');
      return false;
    }
    return true;
  };

  const selectImages = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        aspect: [1, 1],
        allowsEditing: false,
      });

      if (!result.canceled && result.assets) {
        // Limit to 6 images total
        const totalImagesAfterUpload = images.length + result.assets.length;
        if (totalImagesAfterUpload > 6) {
          Alert.alert('Limit Exceeded', `You can only have maximum 6 images. You can add ${6 - images.length} more images.`);
          return;
        }
        
        uploadImages(result.assets);
      }
    } catch (error) {
      console.error('Error selecting images:', error);
      Alert.alert('Error', 'Failed to select images');
    }
  };

  const uploadImages = async (selectedImages) => {

    if (!currentUserId) {
      Alert.alert('Error', 'User ID not found');
      return;
    }

    try {
      setUploading(true);
      const formdata = new FormData();
      formdata.append("user_id", currentUserId.toString());

      selectedImages.forEach((image, index) => {
        const imageUri = image.uri;
        const fileName = `image_${Date.now()}_${index}.jpg`;
        
        formdata.append("images[]", {
          uri: imageUri,
          type: 'image/jpeg',
          name: fileName,
        });
      });

      const response = await fetch(`${baseUrl}upload_user_images`, {
        method: "POST",
        body: formdata,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      
      if (result.status === 200) {
        Alert.alert('Success', 'Images uploaded successfully!');
        // Refresh the gallery
        await fetchUserImages(currentUserId);
      } else {
        console.log("error",result)
        Alert.alert('Error', result.errors || 'Failed to upload images');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      Alert.alert('Error', 'Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const setAsProfilePicture = async (imageId) => {
    try {
      // You'll need to implement this API endpoint
      const formdata = new FormData();
      formdata.append("user_id", currentUserId.toString());
      formdata.append("image_id", imageId.toString());

      const response = await fetch(`${baseUrl}set_profile_picture`, {
        method: "POST",
        body: formdata,
      });

      const result = await response.json();
      
      if (result.status === 200) {
        Alert.alert('Success', 'Profile picture updated successfully!');
        await fetchUserImages(currentUserId);
      } else {
        Alert.alert('Error', result.message || 'Failed to set profile picture');
      }
    } catch (error) {
      console.error('Error setting profile picture:', error);
      Alert.alert('Error', 'Failed to set profile picture');
    }
  };

  const deleteImage = async (imageId) => {
    Alert.alert(
      'Delete Image',
      'Are you sure you want to delete this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // You'll need to implement this API endpoint
              const formdata = new FormData();
              formdata.append("user_id", currentUserId.toString());
              formdata.append("image_id", imageId.toString());

              const response = await fetch(`${baseUrl}delete_user_image`, {
                method: "POST",
                body: formdata,
              });

              const result = await response.json();
              
              if (result.status === 200) {
                Alert.alert('Success', 'Image deleted successfully!');
                await fetchUserImages(currentUserId);
              } else {
                Alert.alert('Error', result.message || 'Failed to delete image');
              }
            } catch (error) {
              console.error('Error deleting image:', error);
              Alert.alert('Error', 'Failed to delete image');
            }
          }
        }
      ]
    );
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const renderEmptyGallery = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="images-outline" size={80} color={Colors.FontColorII} />
      <Text style={styles.emptyTitle}>No Photos Yet</Text>
      <Text style={styles.emptySubtitle}>Add photos to make your profile more attractive</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={selectImages}>
        <Ionicons name="camera" size={24} color="#fff" />
        <Text style={styles.uploadButtonText}>Add Photos</Text>
      </TouchableOpacity>
    </View>
  );

  const renderImageItem = ({ item, index }) => (
    <TouchableOpacity 
      style={styles.imageContainer}
      onPress={() => openImageModal(item)}
    >
      <Image
        source={{ uri: `${baseUrl}${item.image_path}` }}
        style={styles.galleryImage}
      />
      {item.is_profile_picture === 1 && (
        <View style={styles.profileBadge}>
          <Ionicons name="person" size={12} color="#fff" />
        </View>
      )}
      <View style={styles.imageOverlay}>
        <TouchableOpacity
          style={styles.overlayAction}
          onPress={() => deleteImage(item.id)}
        >
          <Ionicons name="trash-outline" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderImageModal = () => (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity 
          style={styles.modalBackdrop}
          onPress={() => setModalVisible(false)}
        />
        <View style={styles.modalContent}>
          <Image
            source={{ uri: selectedImage ? `${baseUrl}${selectedImage.image_path}` : '' }}
            style={styles.modalImage}
            resizeMode="contain"
          />
          <View style={styles.modalActions}>
            {selectedImage?.is_profile_picture !== 1 && (
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setAsProfilePicture(selectedImage.id);
                  setModalVisible(false);
                }}
              >
                <Ionicons name="person" size={20} color={Colors.FontColorI} />
                <Text style={styles.modalButtonText}>Set as Profile Picture</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.modalButton, styles.deleteButton]}
              onPress={() => {
                deleteImage(selectedImage.id);
                setModalVisible(false);
              }}
            >
              <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
              <Text style={[styles.modalButtonText, styles.deleteButtonText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setModalVisible(false)}
        >
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.FontColorI} />
        <Text style={styles.loadingText}>Loading gallery...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color={Colors.FontColorI} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Gallery</Text>
        <TouchableOpacity onPress={selectImages} disabled={uploading || images.length >= 6}>
          <Ionicons 
            name="add" 
            size={28} 
            color={images.length >= 6 ? Colors.FontColorII : Colors.FontColorI} 
          />
        </TouchableOpacity>
      </View>

      {/* Gallery Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Upload Section */}
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>Photos ({images.length}/6)</Text>
          <Text style={styles.sectionSubtitle}>
            {images.length === 0 
              ? "Add photos to make your profile stand out"
              : `You can add ${6 - images.length} more photos`
            }
          </Text>
        </View>

        {/* Images Grid */}
        {images.length === 0 ? (
          renderEmptyGallery()
        ) : (
          <View style={styles.galleryContainer}>
            <FlatList
              data={images}
              numColumns={3}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderImageItem}
              scrollEnabled={false}
              contentContainerStyle={styles.galleryGrid}
            />
            
            {/* Add More Button */}
            {images.length < 6 && (
              <TouchableOpacity 
                style={styles.addMoreButton}
                onPress={selectImages}
                disabled={uploading}
              >
                <Ionicons name="add" size={24} color={Colors.FontColorI} />
                <Text style={styles.addMoreText}>Add More Photos</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Photo Tips</Text>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.tipText}>Use high-quality, clear photos</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.tipText}>Show your face clearly in the first photo</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.tipText}>Add variety - close-ups and full body shots</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.tipText}>Avoid group photos as your main picture</Text>
          </View>
        </View>
      </ScrollView>

      {/* Upload Progress */}
      {uploading && (
        <View style={styles.uploadingOverlay}>
          <ActivityIndicator size="large" color={Colors.FontColorI} />
          <Text style={styles.uploadingText}>Uploading photos...</Text>
        </View>
      )}

      {/* Image Modal */}
      {renderImageModal()}
    </SafeAreaView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.FontColorI,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  uploadSection: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.FontColorI,
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.FontColorII,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.FontColorI,
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.FontColorII,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.FontColorI,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    gap: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  galleryContainer: {
    flex: 1,
  },
  galleryGrid: {
    paddingBottom: 20,
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  profileBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.FontColorI,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
  },
  overlayAction: {
    padding: 4,
  },
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    paddingVertical: 20,
    borderRadius: 10,
    marginTop: 10,
    gap: 10,
  },
  addMoreText: {
    fontSize: 16,
    color: Colors.FontColorI,
    fontWeight: '500',
  },
  tipsSection: {
    backgroundColor: '#F8F8F8',
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 30,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.FontColorI,
    marginBottom: 15,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  tipText: {
    fontSize: 14,
    color: Colors.FontColorII,
    flex: 1,
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.FontColorI,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
  },
  modalImage: {
    width: '100%',
    height: 400,
  },
  modalActions: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 20,
    overflow: 'hidden',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 15,
  },
  modalButtonText: {
    fontSize: 16,
    color: Colors.FontColorI,
  },
  deleteButton: {
    borderBottomWidth: 0,
  },
  deleteButtonText: {
    color: '#FF6B6B',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ImageGalleryScreen;