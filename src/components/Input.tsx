import React from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

type Props = TextInputProps & {
  label?: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  containerStyle?: object;
  inputStyle?: object;
};

export function Input({ label, icon, containerStyle, inputStyle, style, ...rest }: Props) {
  return (
    <View style={[styles.field, containerStyle, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.inputWrapper}>
        {icon ? <Ionicons name={icon} size={20} style={styles.icon} /> : null}
        <TextInput
          style={[styles.inputBox, inputStyle]}
          placeholderTextColor='#9CA3AF'
          {...rest}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    color: theme.colors.title,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    minHeight: 52,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  icon: {
    color: theme.colors.textSecondary,
    marginRight: 10,
  },
  inputBox: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    minHeight: 52,
  },
});
