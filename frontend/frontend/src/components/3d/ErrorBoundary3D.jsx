// components/3d/ErrorBoundary3D.jsx
import React from 'react';

class ErrorBoundary3D extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('3D Component Error (React 19 compatibility):', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="w-full h-96 rounded-xl bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center text-white">
          <div className="text-center">
            <p className="text-xl mb-2">3D Visualization Unavailable</p>
            <p className="text-sm opacity-75">Using 2D fallback view</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary3D;
