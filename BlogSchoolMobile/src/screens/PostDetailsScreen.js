import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
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
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [postResponse, commentsResponse] = await Promise.all([
        api.getPost(postId),
        api.listComments(postId),
      ]);

      const postData = postResponse?.data ?? postResponse ?? null;
      const commentsData = commentsResponse?.data ?? commentsResponse ?? [];

      setPost(postData);
      setComments(Array.isArray(commentsData) ? commentsData : []);
    } catch (err) {
      setError(err?.message || 'Erro ao carregar dados.');
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [postId]);

  const addComment = async () => {
    if (!token) {
      setError('Faça login para comentar.');
      return;
    }

    if (!commentText.trim()) return;

    setError('');
    try {
      await api.createComment(postId, commentText.trim(), token);
      setCommentText('');
      await loadData();
    } catch (err) {
      setError(err?.message || 'Erro ao comentar.');
    }
  };

  const removeComment = async (commentId) => {
    setError('');
    try {
      await api.deleteComment(postId, commentId, token);
      await loadData();
    } catch (err) {
      setError(err?.message || 'Erro ao excluir comentário.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Voltar</Text>
        </TouchableOpacity>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={colors.accentRed} />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.title}>{post?.title || 'Sem título'}</Text>
            <Text style={styles.meta}>
              Por {post?.author || 'Autor'} •{' '}
              {post?.createdAt ? new Date(post.createdAt).toLocaleDateString('pt-BR') : ''}
            </Text>
            <Text style={styles.body}>{post?.content || ''}</Text>

            <Text style={styles.commentsTitle}>Comentários</Text>

            <TextInput
              style={styles.commentInput}
              multiline
              placeholder={token ? 'Escreva um comentário...' : 'Faça login para comentar'}
              placeholderTextColor={colors.inkMuted}
              value={commentText}
              onChangeText={setCommentText}
              textAlignVertical="top"
              editable={!!token}
            />

            <TouchableOpacity
              style={[styles.commentBtn, !token && styles.commentBtnDisabled]}
              onPress={addComment}
            >
              <Text style={styles.commentBtnText}>
                {token ? 'Comentar' : 'Entrar para comentar'}
              </Text>
            </TouchableOpacity>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            {(comments || []).map((comment, index) => {
              const commentId = comment?.id || comment?._id || `comment-${index}`;
              const authorId = comment?.authorId || comment?.author?._id;
              const currentUserId = user?.id || user?._id;
              const canDelete = user && (user.role === 'teacher' || currentUserId === authorId);

              return (
                <View key={commentId} style={styles.commentCard}>
                  <Text style={styles.commentMeta}>
                    {comment?.authorName || 'Usuário'} ({comment?.authorRole || 'student'})
                  </Text>
                  <Text style={styles.commentText}>{comment?.content || ''}</Text>

                  {canDelete ? (
                    <TouchableOpacity onPress={() => removeComment(commentId)}>
                      <Text style={styles.deleteText}>Excluir</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing['3xl'] },

  backBtn: { color: colors.inkMuted, marginBottom: spacing.md, fontWeight: '600' },

  loadingWrap: { alignItems: 'center', paddingVertical: spacing.xl },
  loadingText: { color: colors.inkMuted, marginTop: spacing.sm },

  title: { color: colors.ink, fontSize: typography.sizes['2xl'], fontWeight: '700' },
  meta: { color: colors.inkMuted, marginTop: spacing.sm, marginBottom: spacing.lg },
  body: { color: colors.ink, lineHeight: 22 },

  commentsTitle: {
    color: colors.ink,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    fontWeight: '700',
    fontSize: typography.sizes.lg,
  },
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
    backgroundColor: colors.accentRed,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  commentBtnDisabled: {
    opacity: 0.65,
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