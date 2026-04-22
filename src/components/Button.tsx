import React from 'react';
import { Pressable, StyleSheet, Text, type PressableProps, type StyleProp, type ViewStyle, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'danger-outline';

type ButtonProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  label?: string;
  title?: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  variant?: ButtonVariant;
};

export function Button({ label, title, icon, variant = 'primary', onPress, disabled, style, ...rest }: ButtonProps) {
  const content = label ?? title ?? '';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        variant === 'danger' && styles.danger,
        variant === 'danger-outline' && styles.dangerOutline,
        pressed && styles.pressed,
        style,
      ]}
      android_ripple={{ color: '#EDE9FE' }}
      {...rest}
    >
      <View style={styles.container}>
        {icon ? (
          <Ionicons
            name={icon}
            size={18}
            style={[styles.icon, variant === 'outline' && styles.iconOutline]}
          />
        ) : null}
        <Text
          style={[
            styles.label,
            variant === 'secondary' && styles.secondaryLabel,
            variant === 'outline' && styles.outlineLabel,
            variant === 'danger' && styles.dangerLabel,
            variant === 'danger-outline' && styles.dangerOutlineLabel,
          ]}
        >
          {content}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: theme.colors.button,
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginTop: 12,
  },
  secondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  outline: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  danger: {
    backgroundColor: theme.colors.danger,
  },
  dangerOutline: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.danger,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: theme.colors.buttonText,
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryLabel: {
    color: theme.colors.title,
  },
  outlineLabel: {
    color: theme.colors.title,
  },
  dangerLabel: {
    color: '#fff',
  },
  dangerOutlineLabel: {
    color: theme.colors.danger,
  },
  icon: {
    color: '#fff',
    marginRight: 8,
  },
  iconOutline: {
    color: '#6D28D9',
  },
  pressed: {
    opacity: 0.8,
  },
});
