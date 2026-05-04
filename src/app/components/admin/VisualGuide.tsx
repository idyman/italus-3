import { useState } from "react";
import { X, MousePointer2 } from "lucide-react";

export function VisualGuide() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      >
        📖 Show Guide
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <MousePointer2 size={32} />
              Step-by-Step: Navigate to Test Debug Tab
            </h2>
            <button
              onClick={() => setIsVisible(false)}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Step 1 */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Look at the Top Tabs
            </h3>
            <p className="text-gray-700 mb-3">
              At the very top of this page, you should see horizontal tabs.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
              <div className="flex gap-2 text-sm flex-wrap">
                <div className="px-4 py-2 bg-gray-50 border-2 border-gray-400 rounded">Projects</div>
                <div className="px-4 py-2 bg-white border border-gray-300 rounded">AI Automation</div>
                <div className="px-4 py-2 bg-white border border-gray-300 rounded">Page Settings</div>
                <div className="px-4 py-2 bg-white border border-gray-300 rounded">CV Management</div>
                <div className="px-4 py-2 bg-yellow-100 border-2 border-yellow-500 rounded font-bold">
                  🧪 Test Debug ← CLICK THIS ONE!
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <span className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Click "🧪 Test Debug"
            </h3>
            <p className="text-gray-700 mb-3">
              Find the tab that says <strong className="text-yellow-700">"🧪 Test Debug"</strong> (it has a test tube emoji).
              Click it ONCE.
            </p>
            <div className="bg-yellow-50 border border-yellow-300 p-3 rounded">
              <p className="text-sm font-semibold text-yellow-800">
                💡 Can't see it? Your window might be too narrow. Try:
              </p>
              <ul className="list-disc list-inside text-sm text-yellow-700 mt-2 space-y-1">
                <li>Make your browser window wider</li>
                <li>Zoom out (Ctrl + Minus or Cmd + Minus)</li>
                <li>Scroll the tab area horizontally</li>
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
              What You'll See
            </h3>
            <p className="text-gray-700 mb-3">
              After clicking, the page will change to show:
            </p>
            <div className="space-y-3">
              <div className="border-2 border-purple-300 rounded-lg p-3 bg-purple-50">
                <p className="font-semibold text-purple-900">✅ Purple box with title:</p>
                <p className="text-sm text-purple-800">"🧪 Standalone Image Test"</p>
              </div>
              <div className="border-2 border-purple-300 rounded-lg p-3 bg-purple-50">
                <p className="font-semibold text-purple-900">✅ A blue box showing:</p>
                <p className="text-sm text-purple-800">"Current State: Images Count: 0"</p>
              </div>
              <div className="border-2 border-purple-300 rounded-lg p-3 bg-purple-50">
                <p className="font-semibold text-purple-900">✅ An input box for image URLs</p>
              </div>
              <div className="border-2 border-purple-300 rounded-lg p-3 bg-purple-50">
                <p className="font-semibold text-purple-900">✅ Two big buttons:</p>
                <ul className="text-sm text-purple-800 list-disc list-inside mt-1">
                  <li>🔴 HTML Button - Add Image(0)</li>
                  <li>🟣 ShadCN Button - Add Image(0)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
              Test the Buttons
            </h3>
            <p className="text-gray-700 mb-3">
              Once you're on the Test Debug tab:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Press <kbd className="px-2 py-1 bg-gray-200 rounded border">F12</kbd> to open browser console</li>
              <li>Paste this URL in the input: <code className="bg-gray-100 px-2 py-1 rounded text-sm">https://i.imgur.com/7kZ5XqK.jpeg</code></li>
              <li>Click the <strong>🔴 HTML Button</strong></li>
              <li>Watch the console for logs</li>
              <li>Look for an alert popup</li>
            </ol>
          </div>

          {/* Step 5 */}
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <span className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
              NEW: Debug Monitor
            </h3>
            <p className="text-gray-700 mb-3">
              Look at the <strong>bottom-right corner</strong> of your screen. You'll see a floating panel that says:
            </p>
            <div className="bg-black text-white p-3 rounded-lg border-2 border-yellow-400">
              <div className="bg-yellow-400 text-black font-bold px-3 py-2 rounded mb-2">
                🐛 Debug Monitor
              </div>
              <p className="text-xs text-gray-300">
                This panel will show EVERY click and input event in real-time!
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Every time you click ANYTHING, you'll see:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
              <li>A red circle animation where you clicked</li>
              <li>A log entry in the Debug Monitor</li>
              <li>Console logs with full details</li>
            </ul>
          </div>

          {/* Close Button */}
          <div className="pt-4 border-t">
            <button
              onClick={() => setIsVisible(false)}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Got It! Close Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
