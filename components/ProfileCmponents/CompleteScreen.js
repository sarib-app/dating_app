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
import { completeUserProfile } from '../../Global/Calls/ApiCalls';

const { width, height } = Dimensions.get('window');

// Predefined lists for selection fields
const SELECTION_LISTS = {
  gender: ['Male', 'Female', 'Other'],
  martial_status: ['Never Married', 'Divorced', 'Widowed'],
  children: ['No children', 'Have children', 'Prefer not to say'],
  education: ['High School', 'Bachelors', 'Masters', 'PhD', 'Other'],
  profession: ['Engineer', 'Doctor', 'Teacher', 'Business Owner', 'Student', 'Other'],
  religion: ['Islam', 'Christianity', 'Hinduism', 'Other'],
  religious_sector: ['Sunni', 'Shia', 'Other'],
  personality: ['Introvert', 'Extrovert', 'Ambivert'],
  ethnicity: ['Urdu speaking', 'Punjabi', 'Sindhi', 'Balochi', 'Pathan', 'Other']
};

const CompleteProfileScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    age: '',
    location: '',
    ethnicity: '',
    height: '',
    bio: '',
    martial_status: '',
    children: '',
    education: '',
    profession: '',
    gender: '',
    religion: '',
    religious_sector: '',
    interests: '',
    personality: ''
  });

  // Steps configuration
  const steps = [
    {
      title: 'Basic Info',
      fields: [
        { key: 'age', label: 'Age', icon: 'calendar-outline', keyboardType: 'numeric', required: true },
        { key: 'gender', label: 'Gender', icon: 'person-outline', type: 'select', required: true },
        { key: 'location', label: 'Location', icon: 'location-outline', required: true },
        { key: 'height', label: 'Height', icon: 'resize-outline', required: true }
      ]
    },
    {
      title: 'About You',
      fields: [
        { key: 'bio', label: 'Bio', icon: 'create-outline', multiline: true, required: true },
        { key: 'personality', label: 'Personality', icon: 'happy-outline', type: 'select', required: true },
        { key: 'interests', label: 'Interests', icon: 'heart-outline', multiline: true, required: true }
      ]
    },
    {
      title: 'Background',
      fields: [
        { key: 'education', label: 'Education', icon: 'school-outline', type: 'select', required: true },
        { key: 'profession', label: 'Profession', icon: 'briefcase-outline', type: 'select', required: true },
        { key: 'ethnicity', label: 'Ethnicity', icon: 'people-outline', type: 'select', required: true }
      ]
    },
    {
      title: 'Life & Faith',
      fields: [
        { key: 'martial_status', label: 'Marital Status', icon: 'heart-outline', type: 'select', required: true },
        { key: 'children', label: 'Children', icon: 'people-outline', type: 'select', required: true },
        { key: 'religion', label: 'Religion', icon: 'moon-outline', type: 'select', required: true },
        { key: 'religious_sector', label: 'Religious Sector', icon: 'star-outline', type: 'select', required: true }
      ]
    }
  ];

  const validateStep = () => {
    const currentFields = steps[currentStep].fields;
    const newErrors = {};
    let isValid = true;

    currentFields.forEach(field => {
      if (field.required && !formData[field.key]?.trim()) {
        newErrors[field.key] = 'This field is required';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // Clear error when user types
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
    if (currentStep === 0) {
      navigation.goBack();
    } else {
      setCurrentStep(prev => prev - 1);
    }
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
      const profilePayload = {
        ...formData,
        user_id: parsedUSer.id,
        baseUrl: baseUrl
      };

      const result = await completeUserProfile(profilePayload);
      
      if (result.status === 200) {
        Alert.alert('Success', result.message);
        navigation.navigate('PreferencesScreen');
      } else {
        Alert.alert('Error', result.message || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    if (field.type === 'select') {
      return (
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
      );
    }

    return (
      <InputField
        icon={field.icon}
        placeholder={field.label}
        value={formData[field.key]}
        onChangeText={(text) => handleInputChange(field.key, text)}
        keyboardType={field.keyboardType}
        multiline={field.multiline}
        style={[
          field.multiline && styles.multilineInput,
          errors[field.key] && styles.errorField
        ]}
      />
    );
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
      <Text style={styles.title}>{steps[currentStep].title}</Text>
      <Text style={styles.subtitle}>Step {currentStep + 1} of {steps.length}</Text>

      {/* Form Fields */}
      <ScrollView style={styles.formContainer}>
        {steps[currentStep].fields.map((field) => (
          <View key={field.key} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            {renderField(field)}
            {errors[field.key] && (
              <Text style={styles.errorText}>{errors[field.key]}</Text>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <CustomButton
          title={currentStep === steps.length - 1 ? "Complete Profile" : "Next"}
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
      <View style={styles.backgroundDecoration1} />
      <View style={styles.backgroundDecoration2} />
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
  }
});

export default CompleteProfileScreen;