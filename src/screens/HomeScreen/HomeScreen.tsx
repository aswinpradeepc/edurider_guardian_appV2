import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { styles } from './HomeStyles';
import UserInfo from './UserInfo';
import StudentInfo from './StudentInfo';
import ActionButtons from './ActionButtons';

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

interface Student {
  student_id: string;
  name: string;
  class_grade: string;
  class_grade_display: string;
  phone_number: string | null;
  email: string | null;
  address_text: string;
  coordinates: string | null;
  location_updated_at: string | null;
  guardian_name: string;
  route_plan: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user data
        const userDataString = await AsyncStorage.getItem('user_data');
        const userData = userDataString ? JSON.parse(userDataString) : null;
        setUser(userData);
        
        // Get student ID and access token
        const studentId = await AsyncStorage.getItem('student_id');
        const token = await AsyncStorage.getItem('access_token');
        
        if (studentId && token) {
          // Fetch student details
          const response = await fetch(`https://edurider.radr.in/api/students/${studentId}/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const studentData = await response.json();
            setStudent(studentData);
          } else {
            console.error('Failed to fetch student data:', response.status);
            Alert.alert('Error', 'Failed to load student information');
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogout = async () => {
    try {
      // Clear all stored data
      await AsyncStorage.multiRemove([
        'access_token', 
        'refresh_token', 
        'user_data',
        'student_id'
      ]);
      
      // Navigate back to login
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFA500" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFA500" barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>EduRider</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <UserInfo user={user} />
        {student && <StudentInfo student={student} />}
        <ActionButtons />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;