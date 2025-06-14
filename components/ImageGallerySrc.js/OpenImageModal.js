
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
    Modal
  } from 'react-native';
const { width } = Dimensions.get('window');
import Colors from '../../Global/Branding/colors';
import { Ionicons } from '@expo/vector-icons';
const OpenImageModal = ({imageModalVisible,setImageModalVisible,profileData,setSelectedImageIndex,selectedImageIndex,OtherUSerImage}) =>{
    return (
        <Modal
          visible={imageModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setImageModalVisible(false)}
        >
          <View style={styles.imageModalContainer}>
            {/* Background overlay */}
            <TouchableOpacity 
              style={styles.imageModalBackdrop}
              onPress={() => setImageModalVisible(false)}
            />
            
            {/* Header */}
            <View style={styles.imageModalHeader}>
              <Text style={styles.imageModalTitle}>
                {selectedImageIndex + 1} of {profileData.images.length}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setImageModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            {/* Image viewer with swipe */}
            <View style={styles.imageViewerContainer}>
              <FlatList
                data={profileData.images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                initialScrollIndex={selectedImageIndex}
                keyExtractor={(item) => item.id.toString()}
                onMomentumScrollEnd={(event) => {
                  const newIndex = Math.round(
                    event.nativeEvent.contentOffset.x / width
                  );
                  setSelectedImageIndex(newIndex);
                }}
                renderItem={({ item }) => (
                  <View style={styles.imageSlide}>
                    <Image
                      source={{ uri: `https://muslimdating.coderisehub.com/${item.image_path}` }}
                      style={styles.fullScreenImage}
                      resizeMode="contain"
                    />
                  </View>
                )}
              />
            </View>
            
            {/* Navigation dots */}
            {profileData.images.length > 1 && (
              <View style={styles.dotsContainer}>
                {profileData.images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      { opacity: index === selectedImageIndex ? 1 : 0.5 }
                    ]}
                  />
                ))}
              </View>
            )}
            
            {/* Bottom actions */}
            {
                !OtherUSerImage &&
                <View style={styles.imageModalActions}>
                {profileData.images[selectedImageIndex]?.is_profile_picture === 1 && (
                  <View style={styles.profilePictureIndicator}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.profilePictureText}>Profile Picture</Text>
                  </View>
                )}
                
                <TouchableOpacity 
                  style={styles.managePhotosButton}
                  onPress={() => {
                    setImageModalVisible(false);
                    navigation.navigate("ImageGalleryScreen");
                  }}
                >
                  <Ionicons name="settings-outline" size={16} color={Colors.FontColorI} />
                  <Text style={styles.managePhotosText}>Manage Photos</Text>
                </TouchableOpacity>
              </View>
            }
          
          </View>
        </Modal>
      );
}
export default OpenImageModal

const styles = StyleSheet.create({

    //MODAL IMAGE
  
    galleryGrid: {
      marginTop: 10,
    },
    addImageCard: {
      width: (width - 40) / 3 - 4,
      height: (width - 40) / 3 - 4,
      margin: 2,
      borderRadius: 8,
      backgroundColor: '#F8F8F8',
      borderWidth: 2,
      borderColor: Colors.FontColorI,
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
    },
    addImageText: {
      fontSize: 12,
      color: Colors.FontColorI,
      marginTop: 5,
      textAlign: 'center',
    },
    galleryImageContainer: {
      width: (width - 40) / 3 - 4,
      height: (width - 40) / 3 - 4,
      margin: 2,
      borderRadius: 8,
      overflow: 'hidden',
      position: 'relative',
    },
    galleryImage: {
      width: '100%',
      height: '100%',
    },
    profileImageBadge: {
      position: 'absolute',
      top: 5,
      right: 5,
      backgroundColor: '#FFD700',
      borderRadius: 10,
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    photoCountContainer: {
      alignItems: 'center',
      marginTop: 10,
    },
    photoCountText: {
      fontSize: 12,
      color: Colors.FontColorII,
    },
    
    // Image Modal Styles
    imageModalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
    },
    imageModalBackdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    imageModalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 50,
      paddingHorizontal: 20,
      paddingBottom: 10,
    },
    imageModalTitle: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '500',
    },
    closeButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 20,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageViewerContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    imageSlide: {
      width: width,
      justifyContent: 'center',
      alignItems: 'center',
    },
    fullScreenImage: {
      width: width - 40,
      height: '70%',
    },
    dotsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#fff',
      marginHorizontal: 4,
    },
    imageModalActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    profilePictureIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 215, 0, 0.2)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 15,
    },
    profilePictureText: {
      color: '#FFD700',
      fontSize: 12,
      marginLeft: 5,
    },
    managePhotosButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
    },
    managePhotosText: {
      color: '#fff',
      fontSize: 14,
      marginLeft: 5,
    },
  });
  