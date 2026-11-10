/**
 * AD29 — School messages (View): the notifications inbox. One row per
 * conversation with its unread badge; opening a thread goes to AD30.
 */
import React, { useEffect, useState } from 'react';
import AdminScaffold from '../components/AdminScaffold';
import RecordList from '../components/RecordList';
import { LoadingView, EmptyState, ErrorState } from '../components/FeedbackViews';
import { MessageInboxPresenter } from '../../presenters/MessageInboxPresenter';
import { MessagesModel } from '../../models';

export default function MessageInboxView() {
  const [presenter] = useState(() => new MessageInboxPresenter(MessagesModel));
  const [state, setState] = useState(presenter.initialState);

  useEffect(() => {
    presenter.attach(setState);
    presenter.load();
    return () => presenter.detach();
  }, [presenter]);

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
    </AdminScaffold>
  );
}
