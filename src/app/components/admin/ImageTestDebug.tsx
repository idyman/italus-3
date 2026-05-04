import { useState } from "react";
import { ProjectImageManager } from "../ProjectImageManager";
import type { ProjectImage } from "../../App";

export function ImageTestDebug() {
  const [images, setImages] = useState<ProjectImage[]>([]);

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-4xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4">🧪 Image Manager Test</h2>
      
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Current State:</h3>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(images, null, 2)}
        </pre>
        <p className="mt-2 text-sm">
          <strong>Image Count:</strong> {images.length}
        </p>
      </div>

      <ProjectImageManager
        images={images}
        onChange={(newImages) => {
          console.log('🧪 [ImageTestDebug] onChange called with:', newImages);
          setImages(newImages);
        }}
      />

      <div className="mt-4 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Paste an Imgur URL (e.g., https://i.imgur.com/abc123.jpg)</li>
          <li>Click "Add Image"</li>
          <li>Check the "Current State" box above</li>
          <li>Open browser console (F12) to see debug logs</li>
        </ol>
      </div>
    </div>
  );
}
