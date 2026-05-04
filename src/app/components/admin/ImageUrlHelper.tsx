import { HelpCircle, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

export function ImageUrlHelper() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        <HelpCircle className="w-4 h-4" />
        {isOpen ? 'Hide' : 'Show'} Help: How to Get Image URLs
      </button>

      {isOpen && (
        <div className="mt-3 bg-blue-50 border-2 border-blue-200 rounded-lg p-4 space-y-4">
          <h4 className="font-semibold text-blue-900">📸 Quick Guide: Getting Image URLs from Imgur</h4>
          
          <div className="space-y-3 text-sm text-blue-900">
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <h5 className="font-semibold mb-2">Step 1: Upload to Imgur</h5>
              <ol className="list-decimal list-inside space-y-1 text-blue-800">
                <li>Go to <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="underline">imgur.com</a></li>
                <li>Click "New post" (no account needed!)</li>
                <li>Upload your image</li>
              </ol>
            </div>

            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <h5 className="font-semibold mb-2">Step 2: Get Direct Image Link</h5>
              <ol className="list-decimal list-inside space-y-1 text-blue-800">
                <li><strong>Right-click</strong> on the uploaded image</li>
                <li>Select <strong>"Copy image address"</strong></li>
                <li>Paste here in the admin!</li>
              </ol>
            </div>

            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <h5 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Correct URL Formats
              </h5>
              <div className="space-y-1 font-mono text-xs text-green-700 bg-green-50 p-2 rounded">
                <div>✅ https://i.imgur.com/abc123.jpg</div>
                <div>✅ i.imgur.com/abc123.png</div>
                <div>✅ imgur.com/abc123</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <h5 className="font-semibold mb-2 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                Wrong URL Formats
              </h5>
              <div className="space-y-1 font-mono text-xs text-red-700 bg-red-50 p-2 rounded">
                <div>❌ imgur.com/gallery/abc123</div>
                <div>❌ imgur.com/a/abc123</div>
                <div>❌ m.imgur.com/abc123</div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <p className="text-yellow-900 font-medium">💡 Pro Tip:</p>
              <p className="text-yellow-800 text-xs mt-1">
                The admin automatically fixes Imgur URLs! Just paste any Imgur link and it'll convert it to the direct image URL.
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded p-3">
              <p className="text-purple-900 font-medium">🎯 Other Image Hosts:</p>
              <p className="text-purple-800 text-xs mt-1">
                You can also use Cloudinary, imgbb, Google Drive, or Dropbox. Just make sure the link is publicly accessible!
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-blue-200">
            <p className="text-xs text-blue-700">
              <strong>Still having issues?</strong> Open browser console (F12) to see detailed debugging info, or check the IMGUR-TROUBLESHOOTING.md file in the project root.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
