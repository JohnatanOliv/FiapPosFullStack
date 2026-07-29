import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { spacing, radius } from '../styles/spacing';
import { typography } from '../styles/typography';
import { colors } from '../styles/colors';

export default function HomeButton({ label, subtext, icon, onPress, theme = 'student' }) {
  const isStudent = theme === 'student';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isStudent ? styles.studentButton : styles.teacherButton,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.subtext}>{subtext}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  studentButton: {
    borderColor: 'rgba(126,184,247,0.25)',
  },
  teacherButton: {
    borderColor: 'rgba(247,201,126,0.25)',
  },
  iconWrap: {
    marginBottom: spacing.sm,
  },
  icon: {
    fontSize: 32,
  },
  label: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  subtext: {
    fontSize: typography.sizes.sm,
    color: colors.inkMuted,
    textAlign: 'center',
  },
});