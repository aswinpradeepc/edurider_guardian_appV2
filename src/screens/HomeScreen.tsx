import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';  // Import from App.tsx directly

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  associated_id: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user data from AsyncStorage
    const loadUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('user_data');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      // Clear all stored data
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      await AsyncStorage.removeItem('user_data');
      
      // Navigate back to login
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to EduRider</Text>
      
      {user ? (
        <View style={styles.profileContainer}>
          <Text style={styles.profileText}>User: {user.first_name} {user.last_name}</Text>
          <Text style={styles.profileText}>Email: {user.email}</Text>
          <Text style={styles.profileText}>Role: {user.user_type}</Text>
        </View>
      ) : (
        <Text>Loading profile...</Text>
      )}
      
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  profileText: {
    fontSize: 16,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default HomeScreen;