import { useState } from "react";

export function MinimalTest() {
  const [count, setCount] = useState(0);
  const [urls, setUrls] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleClick = () => {
    console.log("🔴 BUTTON CLICKED!");
    setCount(count + 1);
  };

  const handleAddUrl = () => {
    console.log("🟢 ADD URL CLICKED! Input value:", inputValue);
    if (inputValue.trim()) {
      const newUrls = [...urls, inputValue];
      console.log("🟢 New URLs array:", newUrls);
      setUrls(newUrls);
      setInputValue("");
      console.log("🟢 State updated, input cleared");
    } else {
      console.log("🔴 Input is empty!");
    }
  };

  console.log("🔵 Component render. Count:", count, "URLs:", urls);

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6">🧪 Minimal Functionality Test</h2>
      
      {/* Test 1: Basic Button */}
      <div className="mb-8 p-4 border-2 border-blue-200 rounded">
        <h3 className="font-bold mb-2">Test 1: Basic Button Click</h3>
        <button
          onClick={handleClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Click Me (Count: {count})
        </button>
        <p className="mt-2 text-sm text-gray-600">
          Click the button. Count should increase and you should see console log.
        </p>
      </div>

      {/* Test 2: Input + State */}
      <div className="mb-8 p-4 border-2 border-green-200 rounded">
        <h3 className="font-bold mb-2">Test 2: Input + State Update</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              console.log("⚪ Input changed:", e.target.value);
              setInputValue(e.target.value);
            }}
            placeholder="Type anything..."
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            onClick={handleAddUrl}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add
          </button>
        </div>
        <div className="mt-2">
          <strong>Current Input:</strong> "{inputValue}"
        </div>
        <div className="mt-2">
          <strong>URLs List ({urls.length}):</strong>
          {urls.length === 0 ? (
            <p className="text-gray-500 italic">No URLs yet</p>
          ) : (
            <ul className="list-disc list-inside">
              {urls.map((url, index) => (
                <li key={index}>{url}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Test 3: Real Image URL */}
      <div className="p-4 border-2 border-purple-200 rounded">
        <h3 className="font-bold mb-2">Test 3: Image Display</h3>
        {urls.length > 0 ? (
          <div className="space-y-2">
            {urls.map((url, index) => (
              <div key={index} className="border p-2 rounded">
                <p className="text-xs text-gray-600 mb-1">URL: {url}</p>
                <img 
                  src={url} 
                  alt={`Test ${index}`}
                  className="max-w-full h-32 object-contain border"
                  onLoad={() => console.log(`✅ Image ${index} loaded`)}
                  onError={() => console.log(`❌ Image ${index} failed to load`)}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">Add a URL above to test image loading</p>
        )}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h4 className="font-bold mb-2">📋 Instructions:</h4>
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Open browser console (F12)</li>
          <li>Click the blue button - count should increase</li>
          <li>Type a URL in the input: <code className="bg-gray-100 px-1">https://i.imgur.com/7kZ5XqK.jpeg</code></li>
          <li>Click "Add" - URL should appear in list below</li>
          <li>Image should display at the bottom</li>
          <li>Check console for colored logs (🔴 🟢 ⚪)</li>
        </ol>
      </div>
    </div>
  );
}
