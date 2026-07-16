import { Component, createElement, type ReactNode } from 'react';
import { locationMapLoadErrorMessage } from './locationSelectorLifecycle.ts';

interface Props {
  children: ReactNode;
  onUnavailable: (message: string) => void;
}

interface State {
  failed: boolean;
}

export default class LocationMapErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onUnavailable(locationMapLoadErrorMessage);
  }

  render() {
    if (this.state.failed) {
      return createElement(
        'p',
        {
          className: 'rounded-lg border border-[var(--line)] bg-[var(--paper-soft)] p-4 text-sm',
          role: 'status',
        },
        locationMapLoadErrorMessage,
      );
    }
    return this.props.children;
  }
}
