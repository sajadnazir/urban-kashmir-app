import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { HeaderTwo } from '../components';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';
import { supportService } from '../api/services/supportService';

interface CreateTicketScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const CreateTicketScreen: React.FC<CreateTicketScreenProps> = ({
  onBack,
  onSuccess,
}) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    // { id: 'general', label: 'General Inquiry' },
    { id: 'order_issue', label: 'Order Issue' },
    { id: 'payment_issue', label: 'Payment / Refund' },
    { id: 'technical_support', label: 'Technical Support' },
  ];

  const priorities = [
    { id: 'low', label: 'Low' },
    { id: 'medium', label: 'Medium' },
    { id: 'high', label: 'High' },
  ] as const;

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill in all required fields.',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await supportService.createTicket({
        subject: subject.trim(),
        category,
        message: message.trim(),
        priority,
      });

      Toast.show({
        type: 'success',
        text1: 'Ticket Created',
        text2: 'We will get back to you shortly.',
      });
      
      onSuccess();
    } catch (error: any) {
      console.log('Ticket Creation Error Response:', error?.response?.data);
      
      // Attempt to extract Laravel-style or standard validation errors
      let errorMsg = error?.response?.data?.message || error?.message || 'Something went wrong';
      const errorsObj = error?.response?.data?.errors;
      if (errorsObj && typeof errorsObj === 'object') {
        const firstError = Object.values(errorsObj).flat()[0];
        if (firstError) errorMsg = firstError as string;
      }

      Toast.show({
        type: 'error',
        text1: 'Failed to create ticket',
        text2: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderTwo title="Create Ticket" leftIcon="chevron-left" onLeftPress={onBack} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // Standard offset
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Subject */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Subject *</Text>
            <TextInput
              style={styles.input}
              placeholder="Brief description of your issue"
              placeholderTextColor={COLORS.gray}
              value={subject}
              onChangeText={setSubject}
              editable={!isSubmitting}
            />
          </View>

          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.chip, category === cat.id && styles.chipActive]}
                  onPress={() => setCategory(cat.id)}
                  disabled={isSubmitting}
                >
                  <Text style={[styles.chipText, category === cat.id && styles.chipTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Priority */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityRow}>
              {priorities.map((prio) => (
                <TouchableOpacity
                  key={prio.id}
                  style={[styles.priorityButton, priority === prio.id && styles.priorityButtonActive]}
                  onPress={() => setPriority(prio.id)}
                  disabled={isSubmitting}
                >
                  <Text style={[styles.priorityText, priority === prio.id && styles.priorityTextActive]}>
                    {prio.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Message */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Please describe your issue in detail..."
              placeholderTextColor={COLORS.gray}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              editable={!isSubmitting}
            />
          </View>

        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, (!subject.trim() || !message.trim()) && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting || !subject.trim() || !message.trim()}
          >
            {isSubmitting ? (
              <ActivityIndicator color={COLORS.background} />
            ) : (
              <Text style={styles.submitText}>Submit Ticket</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  inputGroup: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.darkGray,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.darkGray,
  },
  textArea: {
    minHeight: 120,
    paddingTop: SPACING.md,
  },
  chipsRow: {
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: COLORS.primary + '15',
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    fontWeight: FONT_WEIGHTS.medium,
  },
  chipTextActive: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.semiBold,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  priorityButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  priorityText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    fontWeight: FONT_WEIGHTS.medium,
  },
  priorityTextActive: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.bold,
  },
  footer: {
    padding: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? SPACING.lg : SPACING.md,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
  },
});
