import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import { styles } from './LoginStyles';

type TokenInputModalProps = {
  visible: boolean;
  jsonInput: string;
  setJsonInput: (text: string) => void;
  handleJsonSubmit: () => void;
  setShowTokenInput: (visible: boolean) => void;
};

const TokenInputModal: React.FC<TokenInputModalProps> = ({
  visible,
  jsonInput,
  setJsonInput,
  handleJsonSubmit,
  setShowTokenInput
}) => {
  return (
    <Modal
      visible={visible}
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
  );
};

export default TokenInputModal;