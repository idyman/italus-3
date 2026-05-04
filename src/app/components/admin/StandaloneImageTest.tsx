import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Check, AlertCircle, X } from "lucide-react";

interface TestImage {
  url: string;
  description: string;
}

export function StandaloneImageTest() {
  const [images, setImages] = useState<TestImage[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [previewStatus, setPreviewStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const normalizeUrl = (url: string): string => {
    console.log('🔄 Normalizing URL:', url);
    const trimmed = url.trim();
    
    if (!trimmed) return '';
    
    // Already a direct image link
    if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(trimmed)) {
      console.log('✅ Already has image extension:', trimmed);
      return trimmed;
    }
    
    // Imgur URL handling
    if (trimmed.includes('imgur.com/') && !trimmed.includes('i.imgur.com')) {
      const imgurId = trimmed.split('imgur.com/').pop()?.split(/[?#]/)[0];
      if (imgurId) {
        const directUrl = `https://i.imgur.com/${imgurId}.jpg`;
        console.log('✅ Converted to Imgur direct link:', directUrl);
        return directUrl;
      }
    }
    
    // i.imgur.com but missing extension
    if (trimmed.includes('i.imgur.com/') && !/\.(jpg|jpeg|png|gif)$/i.test(trimmed)) {
      const withExtension = `${trimmed}.jpg`;
      console.log('✅ Added .jpg extension to i.imgur.com URL:', withExtension);
      return withExtension;
    }
    
    console.log('⚠️ URL passed through without normalization:', trimmed);
    return trimmed;
  };

  const handleAddClick = () => {
    console.log('\n🟢🟢🟢 ADD BUTTON CLICKED! 🟢🟢🟢');
    console.log('Current input value:', urlInput);
    console.log('Current images array:', images);
    console.log('Images count:', images.length);
    
    if (!urlInput.trim()) {
      console.log('❌ Input is empty');
      alert('Please enter a URL!');
      return;
    }
    
    const normalized = normalizeUrl(urlInput);
    console.log('Normalized URL:', normalized);
    
    const newImage: TestImage = {
      url: normalized,
      description: `Image ${images.length + 1}`
    };
    
    console.log('New image object:', newImage);
    
    const newArray = [...images, newImage];
    console.log('New images array:', newArray);
    console.log('New array length:', newArray.length);
    
    setImages(newArray);
    console.log('✅ setImages called with new array');
    
    setUrlInput("");
    console.log('✅ Input cleared');
    
    setPreviewStatus('idle');
    console.log('✅ Preview status reset');
    
    alert(`Image added! Total images: ${newArray.length}`);
  };

  const handleRemove = (index: number) => {
    console.log('🗑️ Removing image at index:', index);
    const newArray = images.filter((_, i) => i !== index);
    setImages(newArray);
    console.log('✅ Image removed. New count:', newArray.length);
  };

  const handleInputChange = (value: string) => {
    console.log('📝 Input changed:', value);
    setUrlInput(value);
    if (value.trim()) {
      setPreviewStatus('idle');
    }
  };

  console.log('🔵 [Render] Component rendering. Images:', images.length, 'Input:', urlInput);

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-4xl mx-auto my-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">🧪 Standalone Image Test</h2>
        <p className="text-sm text-gray-600">
          This component is NOT inside a form. Pure button clicks only.
        </p>
      </div>

      {/* Current State Display */}
      <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
        <h3 className="font-bold mb-2">📊 Current State:</h3>
        <div className="space-y-1 text-sm">
          <p><strong>Images Count:</strong> {images.length}</p>
          <p><strong>Current Input:</strong> "{urlInput}"</p>
          <p><strong>Preview Status:</strong> {previewStatus}</p>
        </div>
        {images.length > 0 && (
          <details className="mt-2">
            <summary className="cursor-pointer text-xs text-blue-600 hover:text-blue-800">
              Show raw data
            </summary>
            <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(images, null, 2)}
            </pre>
          </details>
        )}
      </div>

      {/* Existing Images */}
      {images.length > 0 && (
        <div className="mb-6 space-y-3">
          <h3 className="font-semibold">📷 Images ({images.length}):</h3>
          {images.map((image, index) => (
            <div key={index} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-white border rounded overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.description}
                      className="w-full h-full object-cover"
                      onLoad={() => console.log(`✅ Image ${index} loaded successfully`)}
                      onError={() => console.log(`❌ Image ${index} failed to load`)}
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold mb-1">{image.description}</p>
                  <p className="text-xs text-gray-600 break-all">{image.url}</p>
                </div>
                <button
                  onClick={() => handleRemove(index)}
                  className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded"
                  title="Remove"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Image - NOT IN A FORM! */}
      <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 bg-purple-50">
        <h3 className="font-semibold mb-4">➕ Add New Image (DIV, not FORM):</h3>
        
        {/* Preview */}
        {urlInput.trim() && (
          <div className="mb-4">
            <Label className="text-sm mb-2 block">Live Preview:</Label>
            <div className="w-full h-48 bg-white border-2 rounded overflow-hidden relative">
              {previewStatus === 'loading' && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              )}
              {previewStatus === 'error' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 z-10">
                  <AlertCircle className="w-8 h-8 text-red-600 mb-2" />
                  <span className="text-sm text-red-600">Failed to load</span>
                </div>
              )}
              {previewStatus === 'success' && (
                <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 z-10">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              <img
                src={normalizeUrl(urlInput)}
                alt="Preview"
                className="w-full h-full object-contain"
                onLoad={() => {
                  console.log('✅ Preview loaded');
                  setPreviewStatus('success');
                }}
                onError={() => {
                  console.log('❌ Preview failed to load');
                  setPreviewStatus('error');
                }}
              />
            </div>
          </div>
        )}

        {/* Input */}
        <div className="mb-4">
          <Label htmlFor="test-url" className="mb-2 block">Image URL:</Label>
          <Input
            id="test-url"
            type="text"
            value={urlInput}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="https://i.imgur.com/xxxxx.jpg"
            className="mb-2"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                console.log('⏎ Enter key pressed - preventing default and calling handleAddClick');
                e.preventDefault();
                e.stopPropagation();
                handleAddClick();
              }
            }}
          />
          <p className="text-xs text-gray-600">
            💡 Press Enter or click button below
          </p>
        </div>

        {/* Add Button - Regular HTML button first */}
        <div className="space-y-2">
          <button
            onClick={(e) => {
              console.log('🔴 RAW HTML BUTTON CLICKED!', e);
              handleAddClick();
            }}
            disabled={!urlInput.trim()}
            className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            🔴 HTML Button - Add Image ({images.length})
          </button>

          <Button
            onClick={(e) => {
              console.log('🟣 SHADCN BUTTON CLICKED!', e);
              handleAddClick();
            }}
            disabled={!urlInput.trim()}
            className="w-full"
          >
            🟣 ShadCN Button - Add Image ({images.length})
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-bold mb-2">📋 Test Instructions:</h4>
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Open browser console (F12) - you MUST do this</li>
          <li>Paste this URL: <code className="bg-white px-1 py-0.5 rounded">https://i.imgur.com/7kZ5XqK.jpeg</code></li>
          <li>Try BOTH buttons (HTML and ShadCN)</li>
          <li>Watch the console for emoji logs</li>
          <li>Check if "Current State" updates above</li>
          <li>Check if image appears in the list</li>
        </ol>
        <div className="mt-3 p-3 bg-white rounded border border-yellow-300">
          <p className="text-sm font-semibold mb-1">✅ Success looks like:</p>
          <ul className="text-xs space-y-0.5 list-disc list-inside">
            <li>Console shows: 🟢🟢🟢 ADD BUTTON CLICKED! 🟢🟢🟢</li>
            <li>"Images Count" increases</li>
            <li>Image appears in the list above</li>
            <li>Alert popup shows "Image added!"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
