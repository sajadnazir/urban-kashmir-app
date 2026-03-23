import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, getFontFamily } from '../constants';
import { normalizeFont } from '../utils/responsive';

export type SortOption = 'price_low' | 'price_high' | 'on_sale' | 'discount' | 'newest' | 'none';

interface SortItem {
  id: SortOption;
  label: string;
  icon: string;
}

const SORT_OPTIONS: SortItem[] = [
  { id: 'none', label: 'Default', icon: 'refresh-cw' },
  { id: 'price_low', label: 'Price: Low to High', icon: 'trending-up' },
  { id: 'price_high', label: 'Price: High to Low', icon: 'trending-down' },
  { id: 'on_sale', label: 'On Sale', icon: 'tag' },
  { id: 'discount', label: 'Highest Discount', icon: 'percent' },
  { id: 'newest', label: 'New Arrivals', icon: 'clock' },
];

interface SortModalProps {
  isVisible: boolean;
  onClose: () => void;
  selectedOption: SortOption;
  onSelectOption: (option: SortOption) => void;
}

export const SortModal: React.FC<SortModalProps> = ({
  isVisible,
  onClose,
  selectedOption,
  onSelectOption,
}) => {
  const renderItem = ({ item }: { item: SortItem }) => {
    const isSelected = item.id === selectedOption;

    return (
      <TouchableOpacity
        style={[styles.optionItem, isSelected && styles.selectedOption]}
        onPress={() => {
          onSelectOption(item.id);
          onClose();
        }}
        activeOpacity={0.7}
      >
        <View style={styles.optionLeft}>
          <View style={[styles.iconContainer, isSelected && styles.selectedIconContainer]}>
            <Icon 
              name={item.icon} 
              size={18} 
              color={isSelected ? COLORS.background : COLORS.gray} 
            />
          </View>
          <Text style={[styles.optionLabel, isSelected && styles.selectedLabel]}>
            {item.label}
          </Text>
        </View>
        {isSelected && (
          <Icon name="check" size={20} color={COLORS.primary} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.content}>
              <View style={styles.header}>
                <View style={styles.dragHandle} />
                <Text style={styles.title}>Sort By</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Icon name="x" size={24} color={COLORS.text} />
                </TouchableOpacity>
              </View>

              <FlatList
                data={SORT_OPTIONS}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '70%',
    paddingBottom: SPACING.xxl,
  },
  header: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    position: 'relative',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    position: 'absolute',
    top: 10,
  },
  title: {
    fontSize: normalizeFont(18),
    fontFamily: getFontFamily('bold'),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  closeButton: {
    position: 'absolute',
    right: SPACING.lg,
    top: SPACING.lg,
  },
  listContent: {
    padding: SPACING.md,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: 15,
    marginBottom: SPACING.xs,
  },
  selectedOption: {
    backgroundColor: '#F9F9F9',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  selectedIconContainer: {
    backgroundColor: COLORS.primary,
  },
  optionLabel: {
    fontSize: normalizeFont(FONT_SIZES.md),
    fontFamily: getFontFamily('medium'),
    color: COLORS.text,
  },
  selectedLabel: {
    fontFamily: getFontFamily('bold'),
    color: COLORS.primary,
  },
});
