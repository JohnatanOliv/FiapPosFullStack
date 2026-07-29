import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../styles/colors';
import { spacing, radius, shadows } from '../styles/spacing';
import { typography } from '../styles/typography';

export default function PostCard({ post, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, shadows.md]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.meta}>
        <Text style={styles.author}>{post.author}</Text>
        <Text style={styles.date}>{post.date}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {post.title}
      </Text>

      <Text style={styles.excerpt} numberOfLines={3}>
        {post.excerpt}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  author: {
    fontSize: typography.sizes.xs,
    color: colors.inkMuted,
  },
  date: {
    fontSize: typography.sizes.xs,
    color: colors.inkMuted,
    opacity: 0.6,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: spacing.md,
    lineHeight: typography.lineHeights.tight,
  },
  excerpt: {
    fontSize: typography.sizes.base,
    color: colors.inkMuted,
    lineHeight: typography.lineHeights.normal,
  },
});