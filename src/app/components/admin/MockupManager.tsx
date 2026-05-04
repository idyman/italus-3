import { useState } from "react";
import { Plus, Trash2, GripVertical, AlertCircle, Check } from "lucide-react";
import type { MockupItem } from "../../App";

interface MockupManagerProps {
  mockups: MockupItem[];
  onChange: (mockups: MockupItem[]) => void;
}

// Helper function to convert Imgur URLs to direct image links
function normalizeImageUrl(url: string): string {
  const trimmed = url.trim();
  
  // If empty, return as-is
  if (!trimmed) return trimmed;
  
  console.log('🔄 [MockupManager] Normalizing URL:', trimmed);
  
  // If it's already a direct image link, return it
  if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(trimmed)) {
    console.log('✅ [MockupManager] Already has image extension:', trimmed);
    return trimmed;
  }
  
  // Handle imgur.com/xyz format (no file extension)
  const imgurMatch = trimmed.match(/imgur\.com\/([a-zA-Z0-9]+)$/);
  if (imgurMatch) {
    const normalized = `https://i.imgur.com/${imgurMatch[1]}.jpg`;
    console.log('✅ [MockupManager] Normalized imgur.com URL:', normalized);
    return normalized;
  }
  
  // Handle i.imgur.com/xyz format (no file extension)
  const iImgurMatch = trimmed.match(/i\.imgur\.com\/([a-zA-Z0-9]+)$/);
  if (iImgurMatch) {
    const normalized = `https://i.imgur.com/${iImgurMatch[1]}.jpg`;
    console.log('✅ [MockupManager] Normalized i.imgur.com URL:', normalized);
    return normalized;
  }
  
  // Handle URLs without protocol
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    const withProtocol = 'https://' + trimmed;
    console.log('⚠️ [MockupManager] Added https:// protocol:', withProtocol);
    return normalizeImageUrl(withProtocol); // Recursively normalize
  }
  
  console.log('⚠️ [MockupManager] URL unchanged:', trimmed);
  return trimmed;
}

export function MockupManager({ mockups, onChange }: MockupManagerProps) {
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [imageLoadStatus, setImageLoadStatus] = useState<Record<string, 'loading' | 'success' | 'error'>>({});

  const handleImageLoad = (id: string) => {
    setImageLoadStatus(prev => ({ ...prev, [id]: 'success' }));
  };

  const handleImageError = (id: string) => {
    setImageLoadStatus(prev => ({ ...prev, [id]: 'error' }));
  };

  const handleAddMockup = () => {
    if (!newImageUrl.trim()) return;

    const newMockup: MockupItem = {
      id: Date.now().toString(),
      imageUrl: normalizeImageUrl(newImageUrl.trim()),
      title: newTitle.trim() || undefined,
    };

    onChange([...mockups, newMockup]);
    setNewImageUrl("");
    setNewTitle("");
    setImageLoadStatus(prev => ({ ...prev, [newMockup.id]: 'loading' }));
  };

  const handleRemoveMockup = (id: string) => {
    onChange(mockups.filter((m) => m.id !== id));
    const newStatus = { ...imageLoadStatus };
    delete newStatus[id];
    setImageLoadStatus(newStatus);
  };

  const handleUpdateMockup = (id: string, field: "imageUrl" | "title", value: string) => {
    const normalizedValue = field === "imageUrl" ? normalizeImageUrl(value) : value;
    onChange(
      mockups.map((m) =>
        m.id === id ? { ...m, [field]: normalizedValue } : m
      )
    );
    if (field === "imageUrl") {
      setImageLoadStatus(prev => ({ ...prev, [id]: 'loading' }));
    }
  };

  return (
    <div className="space-y-4">
      {/* INFO BOX */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="text-sm text-purple-900">
          📱 <strong>Add Multiple Mockups:</strong> You can add as many mockup screens as you want (6+). 
          Add a URL, add a title, click "Add Mockup", then repeat for the next screen!
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Screen Image URL
        </label>
        <input
          type="text"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          placeholder="https://i.imgur.com/xxxxx.png or imgur.com/xxxxx"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
        />
        <p className="text-xs text-gray-500">
          📌 Use Imgur, Cloudinary, or imgbb to host your mockup images. Paste the direct image URL.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Title (optional)
        </label>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Home Screen"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
        />
      </div>

      <button
        type="button"
        onClick={handleAddMockup}
        disabled={!newImageUrl.trim()}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
      >
        <Plus className="w-4 h-4" />
        {mockups.length === 0 ? 'Add First Mockup' : `Add Mockup #${mockups.length + 1}`}
      </button>

      {mockups.length > 0 && mockups.length < 6 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-xs text-green-800">
            ✅ Great! You have {mockups.length} mockup{mockups.length !== 1 ? 's' : ''}. 
            Keep going - add more URLs above to add mockups #{mockups.length + 1}, #{mockups.length + 2}, etc.
          </p>
        </div>
      )}

      {mockups.length >= 6 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <p className="text-xs text-purple-800">
            🎉 Awesome! You have {mockups.length} mockups. You can still add more if needed!
          </p>
        </div>
      )}

      {mockups.length > 0 && (
        <div className="space-y-3 mt-6">
          <h4 className="text-sm font-medium">Mockups ({mockups.length})</h4>
          {mockups.map((mockup) => (
            <div
              key={mockup.id}
              className="border border-gray-200 rounded-lg p-4 space-y-3 bg-white"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-2 cursor-move text-gray-400">
                  <GripVertical className="w-4 h-4" />
                </div>
                
                <div className="flex-1 space-y-3">
                  {/* Preview */}
                  {mockup.imageUrl && (
                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                      {(!imageLoadStatus[mockup.id] || imageLoadStatus[mockup.id] === 'loading') && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                        </div>
                      )}
                      {imageLoadStatus[mockup.id] === 'error' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 text-red-600 z-10">
                          <AlertCircle className="w-8 h-8 mb-2" />
                          <span className="text-sm font-medium">Image failed to load</span>
                          <span className="text-xs">Check URL below</span>
                        </div>
                      )}
                      {imageLoadStatus[mockup.id] === 'success' && (
                        <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 z-10">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <img
                        src={mockup.imageUrl}
                        alt={mockup.title || "Screen preview"}
                        className="w-full h-full object-contain"
                        onLoad={() => handleImageLoad(mockup.id)}
                        onError={() => handleImageError(mockup.id)}
                      />
                    </div>
                  )}

                  {/* Image URL */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">
                      Screen Image URL
                    </label>
                    <input
                      type="text"
                      value={mockup.imageUrl}
                      onChange={(e) =>
                        handleUpdateMockup(mockup.id, "imageUrl", e.target.value)
                      }
                      placeholder="https://i.imgur.com/xxxxx.png"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-black focus:border-transparent font-mono"
                    />
                    {imageLoadStatus[mockup.id] === 'error' && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Image failed to load. Verify the URL is a direct image link.
                      </p>
                    )}
                  </div>

                  {/* Title */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">
                      Title (optional)
                    </label>
                    <input
                      type="text"
                      value={mockup.title || ""}
                      onChange={(e) =>
                        handleUpdateMockup(mockup.id, "title", e.target.value)
                      }
                      placeholder="Home Screen"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveMockup(mockup.id)}
                  className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove mockup"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}