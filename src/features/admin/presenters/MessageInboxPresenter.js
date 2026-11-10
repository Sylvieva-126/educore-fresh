/**
 * AD29 — School messages (the notifications inbox). One row per conversation:
 * guardians, staff groups, broadcast threads. Unread counts come from the
 * backend's read state.
 */
import { ApiError } from '../api/client';

export class MessageInboxPresenter {
  constructor(messagesModel) {
    this.model = messagesModel;
    this._render = null;
    this._navigation = null;
    this._alive = false;
    this.initialState = {
      status: 'loading', // loading | content | empty | error
      conversations: [],
      errorText: null,
    };
    this.state = this.initialState;
  }

  attach(render, navigation) {
    this._render = render;
    this._navigation = navigation;
    this._alive = true;
  }

  detach() {
    this._alive = false;
  }

  _setState(patch) {
    if (!this._alive || !this._render) return;
    this.state = { ...this.state, ...patch };
    this._render(this.state);
  }

  async load() {
    this._setState({ status: 'loading', errorText: null });
    try {
      const result = await this.model.conversations({ page: 1 });
      this._setState({
        status: result.items.length === 0 ? 'empty' : 'content',
        conversations: result.items,
      });
    } catch (error) {
      this._setState({
        status: 'error',
        errorText: error instanceof ApiError ? error.message : 'Could not load the messages.',
      });
    }
  }

  onRetry() {
    return this.load();
  }

  onOpenConversation(conversation) {
    if (this._navigation) {
      this._navigation.navigate('Conversation', { conversationId: conversation.id });
    }
  }
}

export default MessageInboxPresenter;
