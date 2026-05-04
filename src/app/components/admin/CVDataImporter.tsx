import { AlertCircle } from 'lucide-react';

export function CVDataImporter() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-yellow-900 mb-2">CV Data Import Not Available</h3>
          <p className="text-sm text-yellow-800">
            This feature is being migrated to Firebase and will be available in a future update.
            For now, you can upload your CV as a PDF using the CV Uploader in Page Settings.
          </p>
        </div>
      </div>
    </div>
  );
}
