/**
 * AD10 — School settings and admin access (Presenter). The school profile
 * and the admin memberships load in one pass; saving patches the settings,
 * membership edits go through their own endpoints.
 */
import { ApiError } from '../api/client';
import { SchoolSettingsModel } from '../models';

export class SettingsPresenter {
  constructor(settingsModel) {
    this.model = settingsModel;
    this._render = null;
    this._navigation = null;
    this._alive = false;
    this.initialState = {
      status: 'loading', // loading | content | error
      settings: null,
      memberships: [],
      notice: null,
      errorText: null,
      saving: false,
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
      const [settingsResult, membershipsPage] = await Promise.all([
        this.model.get(),
        this.model.adminMemberships(),
      ]);
      this._setState({
        status: 'content',
        settings: settingsResult.settings,
        memberships: membershipsPage.items,
        errorText: null,
      });
    } catch (error) {
      this._setState({
        status: 'error',
        errorText:
          error instanceof ApiError ? error.message : 'Could not load the school settings.',
      });
    }
  }

  onRetry() {
    return this.load();
  }

  async saveSettings(fields) {
    if (this.state.saving) return false;
    if (!fields.schoolName || !fields.schoolName.trim()) {
      this._setState({ notice: null, errorText: 'The school needs a name.' });
      return false;
    }
    this._setState({ saving: true, notice: null, errorText: null });
    try {
      const result = await this.model.update(fields);
      this._setState({
        saving: false,
        settings: result.settings,
        notice: 'School settings saved — the header on every screen follows the name.',
      });
      return true;
    } catch (error) {
      this._setState({
        saving: false,
        notice: null,
        errorText: error instanceof ApiError ? error.message : 'The settings were not saved.',
      });
      return false;
    }
  }

  async addMembership(fields) {
    if (this.state.saving) return false;
    if (!fields.fullName || !fields.fullName.trim()) {
      this._setState({ notice: null, errorText: "Enter the admin's full name." });
      return false;
    }
    if (!fields.email || !fields.email.includes('@')) {
      this._setState({ notice: null, errorText: 'Enter a valid email address.' });
      return false;
    }
    this._setState({ saving: true, notice: null, errorText: null });
    try {
      const result = await this.model.addAdminMembership(fields);
      this._setState({
        saving: false,
        memberships: [...this.state.memberships, result.membership],
        notice: `${result.membership.fullName} can now sign in as ${result.membership.role}. An invitation goes to their email.`,
      });
      return true;
    } catch (error) {
      this._setState({
        saving: false,
        notice: null,
        errorText: error instanceof ApiError ? error.message : 'The admin account was not created.',
      });
      return false;
    }
  }

  async changeMembership(membershipId, patch, label) {
    if (this.state.saving) return;
    this._setState({ saving: true, notice: null, errorText: null });
    try {
      const result = await this.model.updateAdminMembership(membershipId, patch);
      this._setState({
        saving: false,
        memberships: this.state.memberships.map((m) =>
          m.id === membershipId ? result.membership : m,
        ),
        notice: label || 'Admin access updated.',
      });
    } catch (error) {
      this._setState({
        saving: false,
        notice: null,
        errorText: error instanceof ApiError ? error.message : 'The change was not saved.',
      });
    }
  }
}

export default SettingsPresenter;
