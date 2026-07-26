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

      <View style={styles.footer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>👁️ {post.views}</Text>
        </View>
      </View>
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
    marginBottom: spacing.md,
    lineHeight: typography.lineHeights.normal,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.md,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  badgeText: {
    fontSize: typography.sizes.xs,
    color: colors.ink,
  },
});
