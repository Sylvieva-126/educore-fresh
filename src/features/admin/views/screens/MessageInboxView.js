/**
 * AD29 — School messages (View): the notifications inbox. One row per
 * conversation with its unread badge; opening a thread goes to AD30.
 */
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import AdminScaffold from '../components/AdminScaffold';
import RecordList from '../components/RecordList';
import SelectSheet from '../components/SelectSheet';
import { LoadingView, EmptyState, ErrorState } from '../components/FeedbackViews';
import { PrimaryButton } from './AdminHomeView';
import { MessageInboxPresenter } from '../../presenters/MessageInboxPresenter';
import { MessagesModel } from '../../models';
import { spacing } from '../theme';

export default function MessageInboxView({ navigation }) {
  const [presenter] = useState(() => new MessageInboxPresenter(MessagesModel));
  const [state, setState] = useState(presenter.initialState);
  const [newChatSheet, setNewChatSheet] = useState(false);

  useEffect(() => {
    presenter.attach(setState, navigation);
    presenter.load();
    return () => presenter.detach();
  }, [presenter, navigation]);

  return (
    <AdminScaffold
      eyebrow="Messages"
      title="School messages"
      subtitle="Guardian and staff conversations, newest first."
    >
      {state.status === 'loading' ? <LoadingView label="Loading messages…" /> : null}
      {state.status === 'empty' ? (
        <EmptyState title="No conversations yet" hint="Messages you send or receive land here." />
      ) : null}
      {state.status === 'error' ? (
        <ErrorState message={state.errorText} onRetry={() => presenter.onRetry()} />
      ) : null}
      {state.status === 'content' ? (
        <RecordList
          items={state.conversations.map((c) => ({
            id: c.id,
            title: c.title,
            meta: `${c.participantLabel} · ${c.lastMessage} · ${c.lastAt}`,
            status: c.unread > 0 ? 'New' : null,
            raw: c,
          }))}
          onPressItem={(row) => presenter.onOpenConversation(row.raw)}
          emptyText="No conversations yet."
        />
      ) : null}

      <View style={{ marginTop: spacing.md }}>
        <PrimaryButton
          label={state.starting ? 'Creating…' : 'New message'}
          onPress={() => presenter.loadRecipients(() => setNewChatSheet(true))}
          disabled={state.starting}
        />
      </View>

      <SelectSheet
        visible={newChatSheet}
        label="Start a conversation with"
        options={state.recipients.map((r) => ({ label: r, value: r }))}
        value={null}
        onSelect={(v) => {
          setNewChatSheet(false);
          presenter.onStartConversation(v);
        }}
        onClose={() => setNewChatSheet(false)}
      />
    </AdminScaffold>
  );
}
