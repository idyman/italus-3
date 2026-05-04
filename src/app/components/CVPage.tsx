import { useEffect } from "react";
import { motion } from "motion/react";
import type { PageSettings } from "../App";
import { AlertCircle, ArrowLeft } from "lucide-react";

interface CVPageProps {
  pageSettings: PageSettings;
  onBack: () => void;
}

const EASE_OUT = [0.22, 0.61, 0.36, 1] as const;

export function CVPage({ pageSettings, onBack }: CVPageProps) {
  const cvUrl = pageSettings.cvUrl;

  // Open the CV in a new tab once when this view mounts, then bounce back.
  // Doing this in useEffect (not render) avoids double-firing during React's
  // concurrent rendering and makes the navigation predictable.
  useEffect(() => {
    if (!cvUrl) return;
    window.open(cvUrl, "_blank", "noopener,noreferrer");
    const timer = setTimeout(onBack, 500);
    return () => clearTimeout(timer);
  }, [cvUrl, onBack]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Portfolio
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.1 }}
          className="border-2 border-blue-400 bg-blue-50 p-8 rounded-lg"
        >
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-4 text-blue-900">
                {cvUrl ? "Opening CV..." : "CV Not Available"}
              </h2>

              {cvUrl ? (
                <>
                  <p className="text-gray-700 mb-4">
                    Your CV is opening in a new tab. If it doesn't open automatically, click the link below:
                  </p>
                  <a
                    href={cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Open CV
                  </a>
                </>
              ) : (
                <>
                  <p className="text-gray-700 mb-4">
                    No CV has been uploaded yet. Please use the admin dashboard to add a CV URL.
                  </p>

                  <div className="bg-white border border-blue-200 p-4 rounded mb-4">
                    <h3 className="font-semibold mb-2 text-gray-900">To add your CV:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      <li>Go to Admin Dashboard → Page Settings</li>
                      <li>Find the CV Uploader section</li>
                      <li>Upload a PDF or paste a link to your CV</li>
                      <li>Save your changes</li>
                    </ol>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default CVPage;
