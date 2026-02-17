"use client";

import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import ErrorRetry from "./ErrorRetry";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ChatErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ChatErrorBoundary caught:", error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="center min-h-[60vh] px-4">
          <ErrorRetry
            message="予期しないエラーが発生しました。再度お試しください。"
            onRetry={this.handleRetry}
          />
        </div>
      );
    }
    return this.props.children;
  }
}
