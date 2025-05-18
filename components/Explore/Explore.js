import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  Alert,
  ImageBackground,
  ScrollView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../Global/Branding/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import PreferencesModal from '../../Global/components/PreferencesModal';
import PreferencesModal from '../PreferencesComp/PreferenceMOdal';
import { useNavigation } from '@react-navigation/native';
import { baseUrl } from '../Global/Urls';
import { useIsFocused } from '@react-navigation/native';
const { width } = Dimensions.get('window');

const CATEGORIES = ['All', 'Public', 'Private', 'Liked', 'Followed', 'Introvert', 'Extrovert'];

// For testing purposes
const dummyMatches = {
  "matches": [
    {
      "id": 1,
      "first_name": "Sarah",
      "age": 25,
      "location": "Lahore",
      "profile_visibility": "public",
      "personality": "introvert",
      "already_followed": true,
      "already_liked": true,
      "images": [{ "image_path": "user_images/sarah_profile.jpg" }]
    },
    {
      "id": 2,
      "first_name": "Amina",
      "age": 28,
      "location": "Karachi",
      "profile_visibility": "private",
      "personality": "extrovert",
      "already_followed": false,
      "already_liked": true,
      "images": [{ "image_path": "user_images/amina_profile.jpg" }]
    },
    {
        "id": 1,
        "first_name": "Sarah",
        "age": 25,
        "location": "Lahore",
        "profile_visibility": "public",
        "personality": "introvert",
        "already_followed": true,
        "already_liked": false,
        "images": [{ "image_path": "user_images/sarah_profile.jpg" }]
      },
      {
        "id": 2,
        "first_name": "Amina",
        "age": 28,
        "location": "Karachi",
        "profile_visibility": "private",
        "personality": "extrovert",
        "already_followed": false,
        "already_liked": false,
        "images": [{ "image_path": "user_images/amina_profile.jpg" }]
      },
    // Add more dummy data as needed
  ]
};

const ExploreScreen = () => {
    const navigation = useNavigation()
    const focused = useIsFocused()
  const [matches, setMatches] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(['All']);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, [focused]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const user = await AsyncStorage.getItem('user');
      const parsedUSer = JSON.parse(user)
      if(!parsedUSer){
      return
      }
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      const formdata = new FormData();
      const response = await fetch(
        `${baseUrl}find_matches`,
        {
          method: "POST",
          headers: myHeaders,
          body: formdata,
        }
      );
      const result = await response.json();
      console.log(result)
      if (result.status === 200) {
        setMatches(result.matches);
      }
    } catch (error) {
      // For testing, use dummy data on error
      setMatches(dummyMatches.matches);
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category) => {
    if (category === 'All') {
      setSelectedCategories(['All']);
      return;
    }

    setSelectedCategories(prev => {
      const newCategories = prev.filter(cat => cat !== 'All');
      if (newCategories.includes(category)) {
        return newCategories.filter(cat => cat !== category);
      }
      return [...newCategories, category];
    });
  };

  const filterMatches = () => {
    if (selectedCategories.includes('All')) return matches;

    return matches.filter(match => {
      return selectedCategories.every(category => {
        switch (category) {
          case 'Public':
            return match.profile_visibility === 'public';
          case 'Private':
            return match.profile_visibility === 'private';
          case 'Liked':
            return match.already_liked;
          case 'Followed':
            return match.already_followed;
          case 'Introvert':
            return match.personality?.toLowerCase() === 'introvert';
          case 'Extrovert':
            return match.personality?.toLowerCase() === 'extrovert';
          default:
            return true;
        }
      });
    });
  };

  const renderMatchItem = ({ item }) => (
    <ImageBackground 
      source={{ 
        uri: `https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Gisele_Bundchen2.jpg/800px-Gisele_Bundchen2.jpg` // Replace with actual image path in production
      }}
      style={styles.matchCard}
      imageStyle={styles.matchImage}
    >
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      >
        <View style={styles.matchInfo}>
          <Text style={styles.matchName}>{item.first_name}, {item.age}</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              onPress={() => Alert.alert('Subscribe', 'Please purchase subscription to start chatting')}
              style={styles.actionButton}
            >
              <Ionicons name="chatbubble-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
            //   onPress={() => Alert.alert('View Profile', 'View profile modal will be called here')}
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

  return (
    <View style={styles.container}>
        <View style={styles.header}>
        <Text style={styles.headerTitle}>Matches</Text>
        <TouchableOpacity onPress={() => setShowPreferencesModal(true)}>
        <Ionicons name="filter" size={24} color={Colors.FontColorI} />
        </TouchableOpacity>
        </View>
        <View style={{height:60}}>
        <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        >
        {CATEGORIES.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategories.includes(category) && styles.selectedCategory
            ]}
            onPress={() => handleCategorySelect(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategories.includes(category) && styles.selectedCategoryText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      </View>

      <FlatList
        data={filterMatches()}
        renderItem={renderMatchItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.matchesRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.matchesList}
      />

      <PreferencesModal
        visible={showPreferencesModal}
        onClose={() => setShowPreferencesModal(false)}
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
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryButton: {
    // paddingHorizontal: 20,
    // height:50,
    paddingVertical:10,
    paddingHorizontal:20,
    // paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 10,alignItems:'center',justifyContent:'center'

  },
  selectedCategory: {
    backgroundColor: Colors.PrimaryColor,
  },
  categoryText: {
    color: Colors.FontColorI,
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#fff',
  },
  matchesRow: {
    justifyContent: 'space-between',
  },
  matchesList: {
    paddingHorizontal: 20,
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
  matchName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
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
});

export default ExploreScreen;