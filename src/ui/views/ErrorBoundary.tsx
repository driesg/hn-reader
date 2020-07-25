import React, { Component } from "react";

interface Props {}
interface State {
  hasError: boolean;
}

// See https://reactjs.org/docs/error-boundaries.html
// This will catch JS errors in the child component tree.
// Errors in async code, event handlers or SSR  won't be caught
export class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError(_error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // log to error reporting service
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app">
          <p>
            Something went wrong. Please try reloading the page or try again
            later
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
