import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  type = 'primary',
  disabled = false,
  loading = false,
  style,
}) => {
  // Determine styles based on the 'type' prop
  const getButtonStyle = () => {
    switch (type) {
      case 'secondary':
        return styles.secondaryBtn;
      case 'danger':
        return styles.dangerBtn;
      default:
        return styles.primaryBtn;
    }
  };

  const getTextStyle = () => {
    switch (type) {
      case 'secondary':
        return styles.secondaryText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.baseBtn, getButtonStyle(), disabled && styles.disabledBtn, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={type === 'secondary' ? '#166534' : 'white'} />
      ) : (
        <Text style={[styles.baseText, getTextStyle()]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  // Theme Colors
  primaryBtn: {
    backgroundColor: '#166534', // Dark Forest Green
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#166534',
    elevation: 0, // No shadow for outline button
  },
  dangerBtn: {
    backgroundColor: '#EF4444', // Matches your High Priority Red
  },
  disabledBtn: {
    backgroundColor: '#CBD5E1',
    borderColor: '#CBD5E1',
  },
  // Text Styles
  baseText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: '#166534',
  },
});

export default CustomButton;