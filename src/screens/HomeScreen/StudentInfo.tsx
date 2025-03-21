import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './HomeStyles';

type StudentInfoProps = {
  student: {
    name: string;
    class_grade_display: string;
    guardian_name: string;
    phone_number: string | null;
    address_text: string;
    location_updated_at: string | null;
  };
};

const StudentInfo: React.FC<StudentInfoProps> = ({ student }) => {
  return (
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
  );
};

export default StudentInfo;