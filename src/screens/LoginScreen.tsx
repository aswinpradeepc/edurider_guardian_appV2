import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  ActivityIndicator, 
  Modal, 
  TextInput,
  Alert
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

// Register for the authentication callback
WebBrowser.maybeCompleteAuthSession();

type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

interface GoogleAuthResponse {
  auth_url: string;
}

interface AuthTokenResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    user_type: string;
    associated_id: string;
  }
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showTokenInput, setShowTokenInput] = useState<boolean>(false);
  const [jsonInput, setJsonInput] = useState<string>('');
  
  const handleGoogleSignIn = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // First, fetch the Google auth URL from your backend
      const response = await fetch('https://edurider.radr.in/api/auth/parent/google-login/');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data: GoogleAuthResponse = await response.json();
      
      // Open the auth_url in the system browser
      const result = await WebBrowser.openAuthSessionAsync(
        data.auth_url,
        'guardianapp://'
      );

      if (result.type === 'success' || result.type === 'dismiss') {
        // Show the token input modal
        setShowTokenInput(true);
      }
    } catch (error) {
      console.error('Google Sign In Error:', error);
      Alert.alert('Error', 'Failed to start Google authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJsonSubmit = async () => {
    try {
      if (!jsonInput.trim()) {
        Alert.alert('Error', 'Please paste the JSON response');
        return;
      }
      
      // Parse the JSON input
      const authData: AuthTokenResponse = JSON.parse(jsonInput.trim());
      
      // Store tokens and user data
      await AsyncStorage.setItem('access_token', authData.access_token);
      await AsyncStorage.setItem('refresh_token', authData.refresh_token);
      await AsyncStorage.setItem('user_data', JSON.stringify(authData.user));
      
      // Close modal and navigate to home
      setShowTokenInput(false);
      navigation.replace('Home');
    } catch (error) {
      console.error('JSON parsing error:', error);
      Alert.alert('Error', 'Invalid JSON format. Please copy the entire response correctly.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.googleButton}
        onPress={handleGoogleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign in with Google</Text>
        )}
      </TouchableOpacity>

      {/* JSON Input Modal */}
      <Modal
        visible={showTokenInput}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTokenInput(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Authentication Response</Text>
            <Text style={styles.modalSubtitle}>
              Please copy the entire JSON response from the browser and paste it below:
            </Text>
            
            <TextInput
              style={styles.tokenInput}
              value={jsonInput}
              onChangeText={setJsonInput}
              placeholder="Paste JSON response here"
              autoCapitalize="none"
              autoCorrect={false}
              multiline
            />
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowTokenInput(false)}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleJsonSubmit}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  googleButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  tokenInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    height: 150, // Increased height for JSON
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  submitButton: {
    backgroundColor: '#4285F4',
  },
});

export default LoginScreen;