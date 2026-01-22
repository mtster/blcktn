
import React, { useState, useEffect } from 'react';

export const MobileDebugger: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Save original methods
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    const formatMessage = (args: any[]) => {
      return args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg);
          } catch (e) {
            return '[Object]';
          }
        }
        return String(arg);
      }).join(' ');
    };

    const addLog = (type: string, args: any[]) => {
      const msg = formatMessage(args);
      const timestamp = new Date().toLocaleTimeString().split(' ')[0];
      setLogs(prev => [`[${timestamp}] [${type}] ${msg}`, ...prev].slice(0, 100));
    };

    console.log = (...args) => {
      addLog('LOG', args);
      originalLog(...args);
    };

    console.error = (...args) => {
      addLog('ERR', args);
      originalError(...args);
    };

    console.warn = (...args) => {
      addLog('WRN', args);
      originalWarn(...args);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(logs.join('\n'));
    // We could show a toast here, but simple visual feedback is usually enough for debug tools
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-[9999] w-12 h-12 bg-red-500/80 hover:bg-red-500 backdrop-blur-md rounded-full flex items-center justify-center text-2xl shadow-lg shadow-red-500/20 hover:scale-110 transition-transform border border-white/10"
      >
        🐞
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[50vh] bg-[#050505]/95 backdrop-blur-xl border-t border-white/10 z-[9999] flex flex-col font-mono text-[10px] shadow-2xl animate-in slide-in-from-bottom duration-300">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="text-white/60 font-bold uppercase tracking-widest">System Console</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setLogs([])} 
            className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors" 
            title="Clear Logs"
          >
            🗑️
          </button>
          <button 
            onClick={copyToClipboard} 
            className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors" 
            title="Copy to Clipboard"
          >
            📋
          </button>
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors ml-2 border-l border-white/10" 
            title="Minimize"
          >
            ➖
          </button>
        </div>
      </div>
      
      {/* Log Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {logs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-white/20">
            <span className="text-2xl mb-2">⚡</span>
            <span>Awaiting system events...</span>
          </div>
        )}
        {logs.map((log, i) => (
          <div key={i} className={`font-mono break-all py-0.5 border-b border-white/[0.02] ${
            log.includes('[ERR]') ? 'text-red-400 bg-red-500/5 px-2 -mx-2 rounded' : 
            log.includes('[WRN]') ? 'text-amber-400' : 
            'text-emerald-400/80'
          }`}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};
