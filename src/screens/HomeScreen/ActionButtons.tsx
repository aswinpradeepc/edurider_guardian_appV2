import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './HomeStyles';

const ActionButtons: React.FC = () => {
  return (
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
  );
};

export default ActionButtons;