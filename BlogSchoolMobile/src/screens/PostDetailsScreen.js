import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { colors } from '../styles/colors';
import { spacing, radius } from '../styles/spacing';
import { typography } from '../styles/typography';
import { api } from '../services/api';
import { UserContext } from '../context/UserContext';

export default function PostDetailsScreen({ route, navigation }) {
  const { postId } = route.params;
  const { user, token } = useContext(UserContext);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    setError('');
    try {
      const [postResponse, commentsResponse] = await Promise.all([
        api.getPost(postId),
        api.listComments(postId),
      ]);
      setPost(postResponse.data);
      setComments(commentsResponse.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, [postId]);

  const addComment = async () => {
    if (!commentText.trim()) return;
    try {
      await api.createComment(postId, commentText.trim(), token);
      setCommentText('');
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const removeComment = async (commentId) => {
    try {
      await api.deleteComment(postId, commentId, token);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{post?.title}</Text>
        <Text style={styles.meta}>
          Por {post?.author} • {post?.createdAt ? new Date(post.createdAt).toLocaleDateString('pt-BR') : ''}
        </Text>
        <Text style={styles.body}>{post?.content}</Text>

        <Text style={styles.commentsTitle}>Comentários</Text>
        <TextInput
          style={styles.commentInput}
          multiline
          placeholder="Escreva um comentário..."
          placeholderTextColor={colors.inkMuted}
          value={commentText}
          onChangeText={setCommentText}
        />
        <TouchableOpacity style={styles.commentBtn} onPress={addComment}>
          <Text style={styles.commentBtnText}>Comentar</Text>
        </TouchableOpacity>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {comments.map((comment) => {
          const canDelete = user && (user.role === 'teacher' || user.id === comment.authorId);
          return (
            <View key={comment.id} style={styles.commentCard}>
              <Text style={styles.commentMeta}>
                {comment.authorName} ({comment.authorRole})
              </Text>
              <Text style={styles.commentText}>{comment.content}</Text>
              {canDelete ? (
                <TouchableOpacity onPress={() => removeComment(comment.id)}>
                  <Text style={styles.deleteText}>Excluir</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  backBtn: { color: colors.inkMuted, marginBottom: spacing.md },
  title: { color: colors.ink, fontSize: typography.sizes['2xl'], fontWeight: '700' },
  meta: { color: colors.inkMuted, marginTop: spacing.sm, marginBottom: spacing.lg },
  body: { color: colors.ink, lineHeight: 22 },
  commentsTitle: { color: colors.ink, marginTop: spacing.xl, marginBottom: spacing.md, fontWeight: '700' },
  commentInput: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    color: colors.ink,
    minHeight: 90,
    textAlignVertical: 'top',
    padding: spacing.md,
  },
  commentBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.ink,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  commentBtnText: { color: '#fff', fontWeight: '700' },
  commentCard: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  commentMeta: { color: colors.inkMuted, fontSize: typography.sizes.xs },
  commentText: { color: colors.ink, marginTop: spacing.xs },
  deleteText: { color: colors.error, marginTop: spacing.sm },
  error: { color: colors.error, marginTop: spacing.sm },
});
