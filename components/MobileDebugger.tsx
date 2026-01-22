import React, { useState, useEffect, useCallback } from 'react';

const MobileDebugger: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show the debugger on non-localhost environments
    if (window.location.hostname !== 'localhost') {
      setIsVisible(true);
    }

    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;

    const newConsoleLog = (...args: any[]) => {
      setLogs(prevLogs => [...prevLogs, `LOG: ${JSON.stringify(args)}`]);
      originalConsoleLog.apply(console, args);
    };

    const newConsoleError = (...args: any[]) => {
      setLogs(prevLogs => [...prevLogs, `ERROR: ${JSON.stringify(args)}`]);
      originalConsoleError.apply(console, args);
    };

    console.log = newConsoleLog;
    console.error = newConsoleError;

    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
    };
  }, []);

  const copyLogsToClipboard = useCallback(() => {
    navigator.clipboard.writeText(logs.join('\n'));
  }, [logs]);

  if (!isVisible) {
    return null;
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center text-lg font-bold z-50"
      >
        🐞
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 text-white z-50 p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Mobile Debugger</h2>
        <div>
          <button
            onClick={copyLogsToClipboard}
            className="bg-gray-700 px-4 py-2 rounded mr-2"
          >
            Copy Logs
          </button>
          <button
            onClick={() => setExpanded(false)}
            className="bg-red-500 px-4 py-2 rounded"
          >
            X
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto bg-gray-900 p-2 rounded">
        {logs.map((log, index) => (
          <div key={index} className="font-mono text-sm mb-2">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileDebugger;
