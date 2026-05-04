import { useState, useEffect } from "react";

interface DebugLog {
  timestamp: string;
  type: 'click' | 'input' | 'state' | 'error';
  message: string;
}

export function FloatingDebugOverlay() {
  const [logs, setLogs] = useState<DebugLog[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // Track ALL clicks on the page
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const timestamp = new Date().toLocaleTimeString();
      
      // Show visual feedback
      setClickPosition({ x: e.clientX, y: e.clientY });
      setTimeout(() => setClickPosition(null), 1000);

      const log: DebugLog = {
        timestamp,
        type: 'click',
        message: `CLICK on: ${target.tagName}${target.id ? `#${target.id}` : ''}${target.className ? `.${target.className.split(' ')[0]}` : ''} at (${e.clientX}, ${e.clientY})`
      };

      setLogs(prev => [...prev.slice(-9), log]); // Keep last 10 logs
      
      console.log('🔴 CLICK DETECTED:', {
        element: target.tagName,
        id: target.id,
        classes: target.className,
        text: target.textContent?.substring(0, 50),
        position: { x: e.clientX, y: e.clientY },
        isButton: target.tagName === 'BUTTON',
        type: target.getAttribute('type'),
        disabled: target.hasAttribute('disabled')
      });
    };

    // Track ALL inputs
    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const timestamp = new Date().toLocaleTimeString();
      
      const log: DebugLog = {
        timestamp,
        type: 'input',
        message: `INPUT on: ${target.id || target.name || 'unknown'} = "${target.value.substring(0, 30)}${target.value.length > 30 ? '...' : ''}"`
      };

      setLogs(prev => [...prev.slice(-9), log]);
      
      console.log('📝 INPUT DETECTED:', {
        element: target.tagName,
        id: target.id,
        name: target.name,
        value: target.value,
        type: target.type
      });
    };

    document.addEventListener('click', handleClick, true); // Use capture phase
    document.addEventListener('input', handleInput, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('input', handleInput, true);
    };
  }, []);

  return (
    <>
      {/* Click visual feedback */}
      {clickPosition && (
        <div
          className="fixed pointer-events-none z-[9999]"
          style={{
            left: clickPosition.x - 20,
            top: clickPosition.y - 20,
            width: 40,
            height: 40
          }}
        >
          <div className="w-full h-full rounded-full border-4 border-red-500 animate-ping"></div>
        </div>
      )}

      {/* Floating Debug Panel */}
      <div
        className="fixed bottom-4 right-4 z-[9998] bg-black text-white rounded-lg shadow-2xl border-2 border-yellow-400"
        style={{ 
          width: isExpanded ? '400px' : '200px',
          maxHeight: isExpanded ? '500px' : '50px'
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-3 bg-yellow-400 text-black font-bold cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="flex items-center gap-2">
            🐛 Debug Monitor
            {logs.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {logs.length}
              </span>
            )}
          </span>
          <span className="text-lg">{isExpanded ? '▼' : '▲'}</span>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="p-3 space-y-2">
            {/* Instructions */}
            <div className="bg-yellow-900 text-yellow-100 p-2 rounded text-xs">
              <p className="font-bold mb-1">👀 Watching:</p>
              <ul className="list-disc list-inside space-y-0.5 text-[10px]">
                <li>All button clicks</li>
                <li>All input changes</li>
                <li>Console logs everything</li>
              </ul>
            </div>

            {/* Logs */}
            <div className="space-y-1 max-h-[300px] overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-gray-400 text-xs text-center py-4">
                  No events yet. Try clicking something!
                </div>
              ) : (
                logs.map((log, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded text-xs ${
                      log.type === 'click'
                        ? 'bg-red-900 text-red-100'
                        : log.type === 'input'
                        ? 'bg-blue-900 text-blue-100'
                        : log.type === 'error'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-200'
                    }`}
                  >
                    <div className="font-mono text-[10px] text-gray-300 mb-1">
                      {log.timestamp}
                    </div>
                    <div className="break-all">{log.message}</div>
                  </div>
                ))
              )}
            </div>

            {/* Clear Button */}
            {logs.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLogs([]);
                  console.clear();
                  console.log('🧹 Debug logs cleared');
                }}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded transition-colors"
              >
                Clear Logs
              </button>
            )}

            {/* Console Warning */}
            <div className="bg-purple-900 text-purple-100 p-2 rounded text-xs">
              <p className="font-bold mb-1">💡 Open Browser Console (F12)</p>
              <p className="text-[10px]">
                All events are also logged there with full details!
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
