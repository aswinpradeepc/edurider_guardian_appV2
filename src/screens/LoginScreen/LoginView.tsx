import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './LoginStyles';

type LoginViewProps = {
  isLoading: boolean;
  handleGoogleSignIn: () => void;
};

const LoginView: React.FC<LoginViewProps> = ({ isLoading, handleGoogleSignIn }) => {
  return (
    <View style={styles.contentContainer}>
      <View style={styles.logoContainer}>
        <Ionicons name="bus" size={80} color="#FFA500" />
      </View>

      <Text style={styles.title}>EduRider</Text>
      <Text style={styles.subtitle}>Guardian App</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Connect with your child's school bus service to track location, receive notifications, and ensure safe transportation.
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.googleButton}
        onPress={handleGoogleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <Ionicons name="logo-google" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Sign in with Google</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default LoginView;