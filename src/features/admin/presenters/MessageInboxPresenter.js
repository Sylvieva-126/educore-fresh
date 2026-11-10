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
      recipients: [], // groups the office can start a conversation with
      people: [], // the people inside the group picked in the first step
      starting: false,
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

  /** Fetch recipient groups, then hand control back to the View to show the sheet. */
  async loadRecipients(onReady) {
    if (this.state.recipients.length > 0) {
      if (onReady) onReady();
      return;
    }
    try {
      const result = await this.model.recipients({ page: 1 });
      const items = Array.isArray(result) ? result : result.items || [];
      this._setState({ recipients: items });
      if (onReady) onReady();
    } catch {
      this._setState({ errorText: 'Could not load the recipient list — try again.' });
    }
  }

  /** New message step 2: the people inside the group picked in step 1. */
  async loadPeople(group, onReady) {
    try {
      const result = await this.model.recipients({ page: 1, group });
      const items = Array.isArray(result) ? result : result.items || [];
      this._setState({ people: items });
      if (onReady) onReady();
    } catch {
      this._setState({ errorText: 'Could not load that recipient list — try again.' });
    }
  }

  /** New message: create the conversation with the chosen group, open its thread. */
  async onStartConversation(recipient) {
    if (this.state.starting || !recipient) return;
    this._setState({ starting: true });
    try {
      const conversation = await this.model.startConversation({ recipient, title: recipient });
      await this.load();
      if (this._navigation && conversation && conversation.id) {
        this._navigation.navigate('Conversation', { conversationId: conversation.id });
      }
    } catch (error) {
      this._setState({
        errorText:
          error instanceof ApiError ? error.message : 'The conversation could not be started.',
      });
    } finally {
      this._setState({ starting: false });
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
