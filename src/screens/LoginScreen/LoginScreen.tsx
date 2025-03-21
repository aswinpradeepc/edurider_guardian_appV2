import React, { useState } from 'react';
import { SafeAreaView, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import LoginView from './LoginView';
import TokenInputModal from './TokenInputModal';
import { styles } from './LoginStyles';

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

      // Store the student ID for later use
      if (authData.user.associated_id) {
        await AsyncStorage.setItem('student_id', authData.user.associated_id);
      }

      // Close modal and navigate to home
      setShowTokenInput(false);
      navigation.replace('Home');
    } catch (error) {
      console.error('JSON parsing error:', error);
      Alert.alert('Error', 'Invalid JSON format. Please copy the entire response correctly.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoginView isLoading={isLoading} handleGoogleSignIn={handleGoogleSignIn} />
      <TokenInputModal
        visible={showTokenInput}
        jsonInput={jsonInput}
        setJsonInput={setJsonInput}
        handleJsonSubmit={handleJsonSubmit}
        setShowTokenInput={setShowTokenInput}
      />
    </SafeAreaView>
  );
};

export default LoginScreen;