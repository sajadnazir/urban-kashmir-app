import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';
import { HeaderTwo } from '../components';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';
import { addressService } from '../api';
import type { Address, CreateAddressPayload, UpdateAddressPayload } from '../types/address';

interface AddressScreenProps {
  onBack?: () => void;
}

export const AddressScreen: React.FC<AddressScreenProps> = ({ onBack }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Form State
  const [formData, setFormData] = useState<CreateAddressPayload>({
    type: 'home',
    full_name: '',
    phone_number: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    country_code: 'IN',
    is_default: false,
  });

  const fetchAddresses = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await addressService.getAddresses();
      setAddresses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load addresses',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleOpenForm = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        type: address.type || 'home',
        full_name: address.full_name || '',
        phone_number: address.phone_number || address.phone || '',
        address_line_1: address.address_line_1 || '',
        address_line_2: address.address_line_2 || '',
        city: address.city || '',
        state: address.state || '',
        postal_code: address.postal_code || '',
        country: address.country || 'India',
        country_code: address.country_code || 'IN',
        is_default: address.is_default || false,
      });
    } else {
      setEditingAddress(null);
      setFormData({
        type: 'home',
        full_name: '',
        phone_number: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India',
        country_code: 'IN',
        is_default: addresses.length === 0, // Automatically default if it's the first one
      });
    }
    setIsModalVisible(true);
  };

  const handleCloseForm = () => {
    setIsModalVisible(false);
  };

  const validateForm = () => {
    if (!formData.full_name.trim()) return 'Full Name is required';
    if (!formData.phone_number.trim()) return 'Phone Number is required';
    if (!formData.address_line_1.trim()) return 'Address Line 1 is required';
    if (!formData.city.trim()) return 'City is required';
    if (!formData.state.trim()) return 'State is required';
    if (!formData.postal_code.trim()) return 'Postal Code is required';
    return null;
  };

  const handleSubmit = async () => {
    const errorMsg = validateForm();
    if (errorMsg) {
       Toast.show({ type: 'error', text1: 'Validation Error', text2: errorMsg });
       return;
    }

    try {
      setIsSubmitting(true);
      if (editingAddress) {
        // Update
        const payload: UpdateAddressPayload = {
          ...formData,
          phone: formData.phone_number, // API expects phone in PUT based on curl
        };
        await addressService.updateAddress(editingAddress.id, payload);
        Toast.show({ type: 'success', text1: 'Success', text2: 'Address updated successfully' });
      } else {
        // Create
        await addressService.createAddress(formData);
        Toast.show({ type: 'success', text1: 'Success', text2: 'Address added successfully' });
      }
      
      handleCloseForm();
      fetchAddresses(); // Refresh the list
    } catch (error: any) {
      console.error('Failed to save address:', error);
      
      let errorMsg = error?.message || 'Failed to save address';
      if (error?.response?.data) {
        if (error.response.data.errors) {
          // Extract the first Laravel validation error message
          const errors = error.response.data.errors;
          const firstErrorKey = Object.keys(errors)[0];
          errorMsg = errors[firstErrorKey][0];
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      }

      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (address: Address) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Optimistic UI update
              setAddresses(prev => prev.filter(a => a.id !== address.id));
              await addressService.deleteAddress(address.id);
              Toast.show({ type: 'success', text1: 'Success', text2: 'Address deleted' });
            } catch (error) {
              console.error('Failed to delete address:', error);
              Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to delete address' });
              fetchAddresses(); // Refresh to revert
            }
          }
        }
      ]
    );
  };

  const handleSetDefault = async (address: Address) => {
    if (address.is_default) return;
    
    try {
      // Optimistic updat to jump UI immediately
      setAddresses(prev => prev.map(a => ({
        ...a,
        is_default: a.id === address.id,
      })));
      
      await addressService.setDefaultAddress(address.id);
      Toast.show({ type: 'success', text1: 'Success', text2: 'Default address updated' });
    } catch (error) {
      console.error('Failed to set default address:', error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to update default address' });
      fetchAddresses(); // Refresh to revert
    }
  };

  const renderAddressItem = ({ item }: { item: Address }) => (
    <View style={[styles.addressCard, item.is_default && styles.defaultAddressCard]}>
      {item.is_default && (
        <View style={styles.defaultBadge}>
          <Text style={styles.defaultBadgeText}>DEFAULT</Text>
        </View>
      )}
      
      <View style={styles.cardHeader}>
        <View style={styles.typeContainer}>
          <Icon 
            name={item.type.toLowerCase() === 'home' ? 'home' : 'briefcase'} 
            size={18} 
            color={COLORS.primary} 
          />
          <Text style={styles.typeText}>{item.type.toUpperCase()}</Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => handleOpenForm(item)} style={styles.actionButton}>
            <Icon name="edit-2" size={18} color={COLORS.gray} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item)} style={styles.actionButton}>
            <Icon name="trash-2" size={18} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.name}>{item.full_name}</Text>
      <Text style={styles.addressLine}>{item.address_line_1}</Text>
      {item.address_line_2 ? <Text style={styles.addressLine}>{item.address_line_2}</Text> : null}
      <Text style={styles.addressLine}>
        {item.city}, {item.state} {item.postal_code}
      </Text>
      <Text style={styles.addressLine}>{item.country}</Text>
      
      <View style={styles.footer}>
        <Text style={styles.phone}>{item.phone_number || item.phone}</Text>
        
        {!item.is_default && (
          <TouchableOpacity onPress={() => handleSetDefault(item)}>
            <Text style={styles.setDefaultText}>Set as default</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="map" size={64} color={COLORS.lightGray} />
      <Text style={styles.emptyTitle}>No Addresses Found</Text>
      <Text style={styles.emptySubtitle}>
        You haven't added any delivery addresses yet. Add one now to speed up checkout.
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={() => handleOpenForm()}>
        <Text style={styles.emptyButtonText}>Add New Address</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => {
    if (addresses.length === 0) return null;
    return (
      <TouchableOpacity style={styles.listFooterButton} onPress={() => handleOpenForm()}>
        <Icon name="plus" size={20} color={COLORS.primary} />
        <Text style={styles.listFooterButtonText}>Add New Address</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.container}>
        <HeaderTwo 
          title="My Addresses" 
          leftIcon="chevron-left" 
          onLeftPress={onBack} 
          rightIcon="plus"
          onRightPress={() => handleOpenForm()}
        />
        
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        ) : (
          <FlatList
            data={addresses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderAddressItem}
            contentContainerStyle={addresses.length === 0 ? styles.emptyListContent : styles.listContent}
            ListEmptyComponent={renderEmptyState}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
          />
        )}
        
        {/* Address Form Modal */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          presentationStyle="overFullScreen"
          transparent={true}
          onRequestClose={handleCloseForm}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalOverlay}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </Text>
                <TouchableOpacity onPress={handleCloseForm}>
                  <Icon name="x" size={24} color={COLORS.text} />
                </TouchableOpacity>
              </View>
            
              <ScrollView showsVerticalScrollIndicator={false} style={styles.modalBody}>
                {/* Type Selection */}
                <View style={styles.typeSelectorRow}>
                  <TouchableOpacity 
                     style={[styles.typePill, formData.type === 'home' && styles.typePillActive]}
                     onPress={() => setFormData({...formData, type: 'home'})}
                  >
                     <Icon name="home" size={16} color={formData.type === 'home' ? COLORS.background : COLORS.gray} />
                     <Text style={[styles.typePillText, formData.type === 'home' && styles.typePillTextActive]}>Home</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                     style={[styles.typePill, formData.type === 'office' && styles.typePillActive]}
                     onPress={() => setFormData({...formData, type: 'office'})}
                  >
                     <Icon name="briefcase" size={16} color={formData.type === 'office' ? COLORS.background : COLORS.gray} />
                     <Text style={[styles.typePillText, formData.type === 'office' && styles.typePillTextActive]}>Office</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.full_name}
                  onChangeText={(text) => setFormData({ ...formData, full_name: text })}
                  placeholder="John Doe"
                />

                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={formData.phone_number}
                  onChangeText={(text) => setFormData({ ...formData, phone_number: text })}
                  placeholder="+919876543210"
                  keyboardType="phone-pad"
                />

                <Text style={styles.inputLabel}>Address Line 1</Text>
                <TextInput
                  style={styles.input}
                  value={formData.address_line_1}
                  onChangeText={(text) => setFormData({ ...formData, address_line_1: text })}
                  placeholder="House No 123, Street Name"
                />

                <Text style={styles.inputLabel}>Address Line 2 (Optional)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.address_line_2}
                  onChangeText={(text) => setFormData({ ...formData, address_line_2: text })}
                  placeholder="Near Landmark"
                />

                <View style={styles.rowInputs}>
                  <View style={styles.flex1}>
                    <Text style={styles.inputLabel}>City</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.city}
                      onChangeText={(text) => setFormData({ ...formData, city: text })}
                      placeholder="Srinagar"
                    />
                  </View>
                  <View style={styles.inputSpacer} />
                  <View style={styles.flex1}>
                    <Text style={styles.inputLabel}>Postal Code</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.postal_code}
                      onChangeText={(text) => setFormData({ ...formData, postal_code: text })}
                      placeholder="190001"
                      keyboardType="number-pad"
                    />
                  </View>
                </View>

                <Text style={styles.inputLabel}>State</Text>
                <TextInput
                  style={styles.input}
                  value={formData.state}
                  onChangeText={(text) => setFormData({ ...formData, state: text })}
                  placeholder="Jammu and Kashmir"
                />

                <View style={styles.rowInputs}>
                  <View style={styles.flex1}>
                    <Text style={styles.inputLabel}>Country</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.country}
                      onChangeText={(text) => setFormData({ ...formData, country: text })}
                      placeholder="India"
                    />
                  </View>
                  <View style={styles.inputSpacer} />
                  <View style={styles.flex1}>
                    <Text style={styles.inputLabel}>Code</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.country_code}
                      onChangeText={(text) => setFormData({ ...formData, country_code: text })}
                      placeholder="IN"
                      maxLength={2}
                      autoCapitalize="characters"
                    />
                  </View>
                </View>
                
                <View style={styles.defaultCheckboxRow}>
                   <TouchableOpacity 
                     style={styles.checkbox}
                     onPress={() => setFormData({...formData, is_default: !formData.is_default})}
                   >
                      <View style={[styles.checkboxInner, formData.is_default && styles.checkboxChecked]}>
                         {formData.is_default && <Icon name="check" size={14} color={COLORS.background} />}
                      </View>
                      <Text style={styles.checkboxLabel}>Set as Default Address</Text>
                   </TouchableOpacity>
                </View>
                
                <TouchableOpacity 
                  style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color={COLORS.background} />
                  ) : (
                    <Text style={styles.submitButtonText}>Save Address</Text>
                  )}
                </TouchableOpacity>
                <View style={{height: 40}} />
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, backgroundColor: COLORS.lightGray },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: SPACING.md, paddingBottom: 100 },
  emptyListContent: { flexGrow: 1, justifyContent: 'center', padding: SPACING.xl },
  addressCard: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  defaultAddressCard: {
    borderColor: COLORS.primary,
  },
  defaultBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  defaultBadgeText: {
    color: COLORS.background,
    fontSize: 10,
    fontWeight: FONT_WEIGHTS.bold,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  typeText: {
    fontSize: 12,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },
  actions: { flexDirection: 'row', gap: 16 },
  actionButton: { padding: 4 },
  name: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  addressLine: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    marginBottom: 4,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  phone: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
  },
  setDefaultText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.primary,
  },
  listFooterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.1)', // Light primary color
    paddingVertical: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.3)',
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  listFooterButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
  },
  emptyContainer: { alignItems: 'center', justifyContent: 'center' },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 30,
  },
  emptyButtonText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  modalTitle: { fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.bold, color: COLORS.text },
  modalBody: { padding: SPACING.md },
  typeSelectorRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.lg },
  typePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    gap: 8,
  },
  typePillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typePillText: { fontSize: FONT_SIZES.md, fontWeight: FONT_WEIGHTS.medium, color: COLORS.gray },
  typePillTextActive: { color: COLORS.background },
  inputLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  rowInputs: { flexDirection: 'row' },
  flex1: { flex: 1 },
  inputSpacer: { width: SPACING.md },
  defaultCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.sm,
  },
  checkbox: { flexDirection: 'row', alignItems: 'center' },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: FONT_WEIGHTS.medium,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonDisabled: { opacity: 0.7 },
  submitButtonText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
  },
});
