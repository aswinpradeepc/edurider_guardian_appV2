import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { Ionicons } from '@expo/vector-icons'; // Using Expo icons instead of images

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
        <View style={styles.userSection}>
          <View style={styles.userInfoContainer}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={30} color="#FFA500" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.welcomeText}>
                Welcome, {user?.first_name || 'Guardian'}
              </Text>
              <Text style={styles.userRole}>Guardian</Text>
            </View>
          </View>
        </View>
        
        {student && (
          <View style={styles.studentCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Student Information</Text>
            </View>
            
            <View style={styles.studentInfoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>{student.name}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Class</Text>
                <Text style={styles.infoValue}>{student.class_grade_display}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.studentInfoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Guardian</Text>
                <Text style={styles.infoValue}>{student.guardian_name}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{student.phone_number || 'Not available'}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.locationInfo}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.addressText}>{student.address_text}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.locationStatus}>
              <View style={styles.statusIndicator}>
                <View style={[
                  styles.statusDot, 
                  {backgroundColor: student.location_updated_at ? '#4CAF50' : '#FFC107'}
                ]} />
                <Text style={styles.statusText}>
                  {student.location_updated_at 
                    ? 'Location Updated' 
                    : 'Location Not Set'}
                </Text>
              </View>
              <Text style={styles.lastUpdateText}>
                {student.location_updated_at 
                  ? `Last update: ${new Date(student.location_updated_at).toLocaleString()}` 
                  : 'No location updates yet'}
              </Text>
            </View>
          </View>
        )}
        
        <View style={styles.actionCard}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="location" size={24} color="#FFA500" style={styles.actionIcon} />
            <Text style={styles.actionText}>Update Pickup Location</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bus" size={24} color="#FFA500" style={styles.actionIcon} />
            <Text style={styles.actionText}>Track School Bus</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFA500',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  userSection: {
    backgroundColor: '#FFA500',
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  userRole: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  studentCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  studentInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  locationInfo: {
    marginBottom: 10,
  },
  addressText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  locationStatus: {
    marginTop: 4,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#555',
  },
  lastUpdateText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    marginLeft: 18,
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  actionIcon: {
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default HomeScreen;