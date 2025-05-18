import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  Alert, 
  Modal,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InputField from '../../Global/components/InputField';
import CustomButton from '../../Global/CustomButton';
import Colors from '../../Global/Branding/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingModal from '../../Global/components/LoadingModal';
import { saveUserPreferences } from '../../Global/Calls/ApiCalls';

const { width, height } = Dimensions.get('window');

// Predefined lists for selection fields
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

const PreferencesScreen = ({ navigation }) => {
  // ... [Previous state and functions remain the same until styles] ...
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  
  const [formData, setFormData] = useState({
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

  const steps = [
    {
      title: 'Basic Preferences',
      fields: [
        { key: 'age_range', label: 'Age Range', icon: 'calendar-outline', type: 'select', required: true },
        { key: 'location', label: 'Location', icon: 'location-outline', type: 'select', required: true },
        { key: 'height', label: 'Height', icon: 'resize-outline', type: 'select', required: true }
      ]
    },
    {
      title: 'Background Preferences',
      fields: [
        { key: 'education', label: 'Education', icon: 'school-outline', type: 'select', required: true },
        { key: 'profession', label: 'Profession', icon: 'briefcase-outline', type: 'select', required: true },
        { key: 'ethnicity', label: 'Ethnicity', icon: 'people-outline', type: 'select', required: true }
      ]
    },
    {
      title: 'Life & Values',
      fields: [
        { key: 'martial_status', label: 'Marital Status', icon: 'heart-outline', type: 'select', required: true },
        { key: 'children', label: 'Children', icon: 'people-outline', type: 'select', required: true },
        { key: 'religion', label: 'Religion', icon: 'moon-outline', type: 'select', required: true },
        { key: 'religious_sector', label: 'Religious Sector', icon: 'star-outline', type: 'select', required: true }
      ]
    },
    {
      title: 'Personality & Interests',
      fields: [
        { key: 'personality', label: 'Personality Type', icon: 'happy-outline', type: 'select', required: true },
        { key: 'interests', label: 'Interests', icon: 'heart-outline', multiline: true, placeholder: 'Enter interests or type "No preference"' }
      ]
    }
  ];

  const validateStep = () => {
    const currentFields = steps[currentStep].fields;
    const newErrors = {};
    let isValid = true;

    currentFields.forEach(field => {
      if (field.required && !formData[field.key]?.trim()) {
        newErrors[field.key] = 'Please make a selection';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: null }));
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    // if (currentStep === 0) {
    //   navigation.goBack();
    // } else {
    //   setCurrentStep(prev => prev - 1);
    // }
  };

  const openSelectionModal = (field) => {
    setCurrentField(field);
    setModalVisible(true);
  };

  const handleSelection = (value) => {
    handleInputChange(currentField, value);
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      const user = await AsyncStorage.getItem('user');
      const parsedUSer = JSON.parse(user)
      const baseUrl = "await AsyncStorage.getItem('baseUrl');"
if(!parsedUSer){
  return
}
      const preferencesPayload = {
        ...formData,
        user_id: parsedUSer.id,
        baseUrl: baseUrl
      };

      const result = await saveUserPreferences(preferencesPayload);
      
      if (result.status === 200) {
        Alert.alert(
          'Success', 
          'Perfect! Your preferences have been saved. Ready to start searching!',
          [
            { text: 'Start Searching', onPress: () => navigation.navigate('BottomNavigation') }
          ]
        );
      } else {
        Alert.alert('Error', result.message || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save preferences');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons 
          name="chevron-back-outline" 
          size={28} 
          color={Colors.FontColorI}
          onPress={handleBack}
        />
        <View style={styles.progressContainer}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                { backgroundColor: index <= currentStep ? Colors.FontColorI : '#E0E0E0' }
              ]}
            />
          ))}
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Your Preferences</Text>
      <Text style={styles.subtitle}>
        {currentStep === steps.length - 1 
          ? "Last step before you start searching!" 
          : `Step ${currentStep + 1} of ${steps.length}`}
      </Text>

      {/* Form Fields */}
      <ScrollView style={styles.formContainer}>
        {steps[currentStep].fields.map((field) => (
          <View key={field.key} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            {field.type === 'select' ? (
              <TouchableOpacity 
                onPress={() => openSelectionModal(field.key)}
                style={[
                  styles.selectField,
                  errors[field.key] && styles.errorField
                ]}
              >
                <Ionicons name={field.icon} size={20} color={Colors.FontColorII} />
                <Text style={[
                  styles.selectText,
                  formData[field.key] ? styles.selectedText : styles.placeholderText
                ]}>
                  {formData[field.key] || `Select ${field.label}`}
                </Text>
                <Ionicons name="chevron-down" size={20} color={Colors.FontColorII} />
              </TouchableOpacity>
            ) : (
              <InputField
                icon={field.icon}
                placeholder={field.placeholder || field.label}
                value={formData[field.key]}
                onChangeText={(text) => handleInputChange(field.key, text)}
                multiline={field.multiline}
                style={[
                  field.multiline && styles.multilineInput,
                  errors[field.key] && styles.errorField
                ]}
              />
            )}
            {errors[field.key] && (
              <Text style={styles.errorText}>{errors[field.key]}</Text>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <CustomButton
          title={currentStep === steps.length - 1 ? "Complete Setup" : "Next"}
          onPress={handleNext}
        />
      </View>

      {/* Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select {currentField}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
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

      <LoadingModal show={loading} />

      {/* Background Decorations */}
      <View style={[styles.backgroundDecoration1, { opacity: 0.03 }]} />
      <View style={[styles.backgroundDecoration2, { opacity: 0.03 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 30,
  },
  progressContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.FontColorI,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.FontColorII,
    marginBottom: 30,
  },
  formContainer: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    color: Colors.FontColorII,
    marginBottom: 8,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
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
  buttonContainer: {
    paddingVertical: 20,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: height * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
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
  backgroundDecoration1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.FontColorI,
    opacity: 0.05,
  },
  backgroundDecoration2: {
    position: 'absolute',
    bottom: -50,
    left: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.FontColorI,
    opacity: 0.05,
  },
  multilineInput: {
    minHeight: 100,
    maxHeight: 150,
    textAlignVertical: 'top',
    paddingTop: 12,
  }
});

export default PreferencesScreen;