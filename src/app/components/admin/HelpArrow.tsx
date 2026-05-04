import { useState, useEffect } from "react";
import { ArrowDown, X } from "lucide-react";

interface HelpArrowProps {
  show: boolean;
  onDismiss: () => void;
}

export function HelpArrow({ show, onDismiss }: HelpArrowProps) {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-[140px] right-[200px] z-[9990] pointer-events-none">
      {/* Dismiss Button */}
      <button
        onClick={onDismiss}
        className="absolute -top-2 -right-2 pointer-events-auto bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
        title="Dismiss help"
      >
        <X size={16} />
      </button>

      {/* Arrow and Text */}
      <div className={`transition-transform duration-500 ${isAnimating ? '-translate-y-2' : 'translate-y-2'}`}>
        {/* Text Box */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold px-6 py-3 rounded-lg shadow-2xl mb-2 border-4 border-yellow-600">
          <p className="text-lg whitespace-nowrap">
            👆 Click "🧪 Test Debug" Tab!
          </p>
          <p className="text-xs text-black opacity-75 mt-1">
            It's at the top of the page →
          </p>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <ArrowDown size={48} className="text-yellow-500 stroke-[3]" />
        </div>
      </div>

      {/* Pulsing Circle */}
      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="w-16 h-16 rounded-full bg-yellow-400 opacity-50 animate-ping"></div>
      </div>
    </div>
  );
}
