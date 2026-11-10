/**
 * AD30 — One private conversation (View). The message history with a
 * separator line between rows, then the reply box. Reached from AD29 by
 * tapping a conversation in the inbox.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import AdminScaffold from '../components/AdminScaffold';
import { LoadingView, ErrorState } from '../components/FeedbackViews';
import { PrimaryButton } from './AdminHomeView';
import { ConversationPresenter } from '../../presenters/ConversationPresenter';
import { MessagesModel } from '../../models';
import { colors, typography, spacing } from '../theme';

export default function ConversationView({ route }) {
  const [presenter] = useState(() => new ConversationPresenter(MessagesModel));
  const [state, setState] = useState(presenter.initialState);
  const [replyText, setReplyText] = useState('');
  const conversationId = route.params?.conversationId;

  useEffect(() => {
    presenter.attach(setState);
    presenter.load(conversationId);
    return () => presenter.detach();
  }, [presenter, conversationId]);

  const c = state.conversation;

  return (
    <AdminScaffold
      eyebrow="Messages"
      title={c ? c.title : 'Conversation'}
      subtitle={c ? `With ${c.participantLabel}` : undefined}
    >
      {state.status === 'loading' ? <LoadingView label="Loading the conversation…" /> : null}
      {state.status === 'error' ? (
        <ErrorState message={state.errorText} onRetry={() => presenter.onRetry()} />
      ) : null}

      {state.status === 'content' ? (
        <View>
          {state.messages.length === 0 ? (
            <Text style={styles.empty}>
              No messages yet — write the first one below.
            </Text>
          ) : (
            state.messages.map((m) => (
              <View key={m.id} style={styles.messageRow}>
                <Text style={styles.author}>{m.author}</Text>
                <Text style={styles.messageText}>{m.text}</Text>
                <Text style={styles.time}>{m.at}</Text>
              </View>
            ))
          )}

          {state.errorText && state.replyFailed ? (
            <Text style={styles.error}>{state.errorText}</Text>
          ) : null}
          <TextInput
            style={styles.input}
            multiline
            placeholder="Write a message…"
            placeholderTextColor={colors.muted}
            value={replyText}
            onChangeText={setReplyText}
          />
          <PrimaryButton
            label={state.sending ? 'Sending…' : 'Send message'}
            disabled={!replyText.trim() || state.sending}
            onPress={() => {
              presenter.onSend(replyText);
              setReplyText('');
            }}
          />
        </View>
      ) : null}
    </AdminScaffold>
  );
}

const styles = StyleSheet.create({
  messageRow: {
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  author: { ...typography.label, color: colors.primary, marginBottom: 2 },
  messageText: { ...typography.body },
  time: { ...typography.label, color: colors.muted, marginTop: 2 },
  empty: { ...typography.body, color: colors.muted, marginTop: spacing.sm },
  error: { ...typography.label, color: '#a33a2a', marginBottom: spacing.sm },
  input: {
    ...typography.input,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 56,
    marginTop: spacing.md,
  },
});
