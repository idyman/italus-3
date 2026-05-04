import { useRef, useState } from 'react';
import { Link, Upload } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { uploadFile } from '../../../lib/uploadFile';

interface CVUploaderProps {
  currentCvUrl?: string;
  onUpload: (url: string) => void;
}

export function CVUploader({ currentCvUrl, onUpload }: CVUploaderProps) {
  const [urlInput, setUrlInput] = useState(currentCvUrl || '');
  const [showInput, setShowInput] = useState(!currentCvUrl);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }

    try {
      new URL(urlInput);
      onUpload(urlInput);
      setShowInput(false);
      toast.success('CV URL updated successfully!');
    } catch (error) {
      toast.error('Please enter a valid URL');
    }
  };

  const handleFileSelected = async (file: File | null | undefined) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadFile(file, {
        folder: 'cv',
        maxSizeBytes: 20 * 1024 * 1024,
        allowedMimePrefix: 'application/pdf',
      });
      onUpload(url);
      setUrlInput(url);
      setShowInput(false);
      toast.success('CV uploaded successfully!');
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>CV/Resume URL</Label>
        {currentCvUrl && !showInput && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowInput(true)}
          >
            Change URL
          </Button>
        )}
      </div>

      {currentCvUrl && !showInput && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 mb-2">✓ CV is set</p>
          <a
            href={currentCvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline break-all"
          >
            {currentCvUrl}
          </a>
        </div>
      )}

      {/* Upload from computer */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => handleFileSelected(e.target.files?.[0])}
      />
      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full gap-2"
      >
        <Upload className="w-4 h-4" />
        {isUploading ? 'Uploading…' : currentCvUrl ? 'Replace CV PDF' : 'Upload CV PDF'}
      </Button>
      <p className="text-xs text-gray-500 -mt-2">
        PDF only · up to 20&nbsp;MB
      </p>

      {showInput && (
        <div className="space-y-3 p-4 border border-gray-300 rounded-lg bg-white">
          <div>
            <Label htmlFor="cv-url">Or paste a CV/Resume URL</Label>
            <Input
              id="cv-url"
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://drive.google.com/your-cv.pdf"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-2">
              📌 If you'd rather host your CV elsewhere, paste a public URL from Google Drive, Dropbox, etc.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleSubmit}
              className="flex-1"
            >
              <Link className="w-4 h-4 mr-2" />
              Save CV URL
            </Button>
            {currentCvUrl && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowInput(false);
                  setUrlInput(currentCvUrl);
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded p-3">
        <div className="font-semibold mb-1">💡 How to host your CV:</div>
        <ul className="space-y-1 list-disc pl-4">
          <li>Upload to Google Drive and get a shareable link</li>
          <li>Upload to Dropbox and create a public link</li>
          <li>Use any PDF hosting service (e.g., docdroid.net, pdfhost.io)</li>
        </ul>
      </div>
    </div>
  );
}
