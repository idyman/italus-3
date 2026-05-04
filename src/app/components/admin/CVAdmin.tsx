import { AlertCircle } from 'lucide-react';

export function CVAdmin() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="border-2 border-yellow-400 bg-yellow-50 p-8 rounded-lg">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-4 text-yellow-900">CV Management Not Yet Available</h2>
              <p className="text-gray-700 mb-4">
                The CV Admin feature is being migrated to work with Firebase/Firestore. This feature will be available in a future update.
              </p>
              
              <div className="bg-white border border-yellow-200 p-4 rounded mb-4">
                <h3 className="font-semibold mb-2 text-gray-900">What you can do now:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Use the CV Uploader in Page Settings to add a link to your CV/Resume</li>
                  <li>Upload your CV to Google Drive or Dropbox and paste the public link</li>
                  <li>Your CV will be available for download on your portfolio page</li>
                </ul>
              </div>

              <p className="text-sm text-gray-600">
                The full CV builder with structured data storage is coming soon with Firebase integration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
