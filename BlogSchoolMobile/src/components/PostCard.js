import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../styles/colors';
import { spacing, radius, shadows } from '../styles/spacing';
import { typography } from '../styles/typography';

export default function PostCard({ post, onPress }) {
  return (
    <TouchableOpacity style={[styles.card, shadows.sm]} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.meta}>
        <Text style={styles.author} numberOfLines={1}>{post.author}</Text>
        <Text style={styles.date}>{post.date}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>{post.title}</Text>
      <Text style={styles.excerpt} numberOfLines={3}>{post.excerpt}</Text>

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
    borderColor: colors.border,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  author: { fontSize: typography.sizes.xs, color: colors.inkMuted, fontWeight: '600', maxWidth: '68%' },
  date: { fontSize: typography.sizes.xs, color: colors.inkMuted },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: spacing.sm,
    lineHeight: 26,
  },
  excerpt: {
    fontSize: typography.sizes.sm,
    color: colors.inkMuted,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.md,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface2,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  badgeText: { fontSize: typography.sizes.xs, color: colors.ink },
});