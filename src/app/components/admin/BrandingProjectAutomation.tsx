import { toast } from "sonner";

export function BrandingProjectAutomation() {
  // This feature is temporarily disabled as it requires Firebase Storage
  // which is not available in the current Firebase setup
  return (
    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8 text-center">
      <div className="text-4xl mb-4">🚧</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Feature Temporarily Unavailable
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        The Branding Project Automation feature requires file storage capabilities that are not currently available.
        This feature will be re-enabled in a future update with Firebase Storage integration.
      </p>
      <p className="text-xs text-gray-500">
        In the meantime, you can create projects manually using the Projects tab and add images via URL.
      </p>
    </div>
  );
}
