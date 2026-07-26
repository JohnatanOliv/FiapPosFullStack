import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, studentTheme, teacherTheme } from '../styles/colors';
import { spacing, radius } from '../styles/spacing';
import { typography } from '../styles/typography';

export default function HomeButton({ 
  label, 
  subtext, 
  icon, 
  onPress, 
  theme = 'student' 
}) {
  const themeColor = theme === 'student' ? studentTheme : teacherTheme;
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          borderColor: themeColor.primaryBorder,
          backgroundColor: themeColor.primaryLight,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.subtext}>{subtext}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
  },
  icon: {
    fontSize: 32,
  },
  label: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.ink,
  },
  subtext: {
    fontSize: typography.sizes.xs,
    color: colors.inkMuted,
    marginTop: spacing.sm,
  },
});
