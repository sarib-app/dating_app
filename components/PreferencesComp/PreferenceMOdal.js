

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../Global/Branding/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CustomButton from '../../Global/CustomButton';
import InputField from '../../Global/components/InputField';
// import LoadingModal from './LoadingModal';
import LoadingModal from '../../Global/components/LoadingModal';
// import { saveUserPreferences } from '../Calls/ApiCalls';
import { saveUserPreferences } from '../../Global/Calls/ApiCalls';


const { height } = Dimensions.get('window');

const SELECTION_LISTS = {
  age_range: ['18-25', '20-30', '25-35', '30-40', '35-45', '40-50', '45+', 'No preference'],
  location: ['Lahore', 'Karachi', 'Islamabad', 'Any City', 'No preference'],
  ethnicity: ['Urdu speaking', 'Punjabi', 'Sindhi', 'Balochi', 'Pathan', 'No preference'],
  height: ['5\'0" - 5\'4"', '5\'4" - 5\'8"', '5\'8" - 6\'0"', '6\'0"+', 'No preference'],
  martial_status: ['Never Married', 'Divorced', 'Widowed', 'No preference'],
  children: ['No children', 'Have children', 'Open to both', 'No preference'],
  education: ['High School', 'Bachelors', 'Masters', 'PhD', 'No preference'],
  profession: ['Engineer', 'Doctor', 'Teacher', 'Business Owner', 'Student', 'No preference'],
  religion: ['Islam', 'Christianity', 'Hinduism', 'No preference'],
  religious_sector: ['Sunni', 'Shia', 'Other', 'No preference'],
  personality: ['Introvert', 'Extrovert', 'Ambivert', 'No preference']
};

const PreferencesModal = ({ visible, onClose }) => {
  const [preferences, setPreferences] = useState({
    age_range: '',
    location: '',
    ethnicity: '',
    height: '',
    martial_status: '',
    children: '',
    education: '',
    profession: '',
    religion: '',
    religious_sector: '',
    personality: '',
    interests: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState(null);

  useEffect(() => {
    if (visible) {
      fetchPreferences();
    }
  }, [visible]);

  const fetchPreferences = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      const formdata = new FormData();
      formdata.append("user_id", "2");

      const response = await fetch(
        "https://muslimdating.coderisehub.com/api/get_user_preferences",
        {
          method: "POST",
          body: formdata,
        }
      );
      const result = await response.json();
      if (result.status === 200) {
        const { age_min, age_max } = result.data;
        setPreferences({
          ...result.data,
          age_range: `${age_min}-${age_max}`,
          interests: result.data.interests || 'No preference',
          ethnicity: result.data.ethnicity || 'No preference',
          height: result.data.height || 'No preference',
          personality: result.data.personality || 'No preference',
          religious_sector: result.data.religious_sector || 'No preference'
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch preferences');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // List of required fields
    const requiredFields = [
      'age_range',
      'location',
      'ethnicity',
      'height',
      'martial_status',
      'children',
      'education',
      'profession',
      'religion',
      'religious_sector',
      'personality'
    ];

    requiredFields.forEach(key => {
      if (!preferences[key] || preferences[key].trim() === '') {
        newErrors[key] = 'This field is required';
        isValid = false;
      }
    });

    // Interests can be empty or 'No preference'
    if (!preferences.interests) {
      preferences.interests = 'No preference';
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('user_id');
      const baseUrl = await AsyncStorage.getItem('baseUrl');

      const result = await saveUserPreferences({
        ...preferences,
        user_id: "2",
        baseUrl: "baseUrl"
      });
      
      if (result.status === "200") {
        Alert.alert('Success', 'Preferences updated successfully');
        onClose();
      } else {
        Alert.alert('Error', result.message || 'Failed to update preferences');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const openSelectionModal = (field) => {
    setCurrentField(field);
    setSelectionModalVisible(true);
  };

  const handleSelection = (value) => {
    setPreferences(prev => ({ ...prev, [currentField]: value }));
    setSelectionModalVisible(false);
  };

  const renderField = (key, label, icon) => (
    <View key={key} style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity 
        onPress={() => openSelectionModal(key)}
        style={[
          styles.selectField,
          errors[key] && styles.errorField
        ]}
      >
        <Ionicons name={icon} size={20} color={Colors.FontColorII} />
        <Text style={[
          styles.selectText,
          preferences[key] ? styles.selectedText : styles.placeholderText
        ]}>
          {preferences[key] || `Select ${label}`}
        </Text>
        <Ionicons name="chevron-down" size={20} color={Colors.FontColorII} />
      </TouchableOpacity>
      {errors[key] && (
        <Text style={styles.errorText}>{errors[key]}</Text>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Update Preferences</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.FontColorI} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            {renderField('age_range', 'Age Range', 'calendar-outline')}
            {renderField('location', 'Location', 'location-outline')}
            {renderField('ethnicity', 'Ethnicity', 'people-outline')}
            {renderField('height', 'Height', 'resize-outline')}
            {renderField('martial_status', 'Marital Status', 'heart-outline')}
            {renderField('children', 'Children', 'people-outline')}
            {renderField('education', 'Education', 'school-outline')}
            {renderField('profession', 'Profession', 'briefcase-outline')}
            {renderField('religion', 'Religion', 'moon-outline')}
            {renderField('religious_sector', 'Religious Sector', 'star-outline')}
            {renderField('personality', 'Personality Type', 'happy-outline')}
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Interests</Text>
              <InputField
                icon="heart-outline"
                placeholder="Enter interests or type 'No preference'"
                value={preferences.interests}
                onChangeText={(text) => setPreferences(prev => ({ ...prev, interests: text }))}
                multiline
                style={[
                  styles.multilineInput,
                  errors.interests && styles.errorField
                ]}
              />
              {errors.interests && (
                <Text style={styles.errorText}>{errors.interests}</Text>
              )}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <CustomButton
              title="Update Preferences"
              onPress={handleUpdate}
            />
          </View>

          <Modal
            visible={selectionModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setSelectionModalVisible(false)}
          >
            <View style={styles.selectionModalContainer}>
              <View style={styles.selectionModalContent}>
                <View style={styles.selectionModalHeader}>
                  <Text style={styles.selectionModalTitle}>
                    Select {currentField?.replace('_', ' ')}
                  </Text>
                  <TouchableOpacity onPress={() => setSelectionModalVisible(false)}>
                    <Ionicons name="close" size={24} color={Colors.FontColorI} />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={currentField ? SELECTION_LISTS[currentField] : []}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.optionItem}
                      onPress={() => handleSelection(item)}
                    >
                      <Text style={styles.optionText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>
        </View>
      </View>

      <LoadingModal show={loading} />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.FontColorI,
  },
  form: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    color: Colors.FontColorII,
    marginBottom: 8,
  },
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 4,
  },
  selectText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  selectedText: {
    color: Colors.FontColorI,
  },
  placeholderText: {
    color: Colors.FontColorII,
  },
  errorField: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  multilineInput: {
    minHeight: 100,
    maxHeight: 150,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  selectionModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  selectionModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.7,
  },
  selectionModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  selectionModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.FontColorI,
  },
  optionItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  optionText: {
    fontSize: 16,
    color: Colors.FontColorI,
  },
});

export default PreferencesModal;