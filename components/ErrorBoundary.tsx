import React, { ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Fix: Explicitly extending React.Component and using a constructor ensures 'props' and 'state' are correctly typed and visible within the class.
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20 mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Application Error</h1>
          <p className="text-white/50 mb-8 max-w-md mx-auto">
            The dashboard encountered a critical error during rendering. 
            This usually happens due to missing configuration or network issues.
          </p>
          
          <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-left w-full max-w-2xl overflow-auto mb-8">
            <p className="text-[10px] uppercase font-bold text-white/30 mb-2">Error Details</p>
            <code className="text-xs font-mono text-red-300">
              {this.state.error?.toString() || "Unknown Error"}
            </code>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-emerald-400 transition-all"
          >
            Reload Platform
          </button>
        </div>
      );
    }

    // Fix: Children are now safely accessed via this.props as the component inheritance is properly configured.
    return this.props.children;
  }
}
