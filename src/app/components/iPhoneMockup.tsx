import { ImageWithFallback } from "./figma/ImageWithFallback";

interface IPhoneMockupProps {
  screenImage: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
}

export function IPhoneMockup({ screenImage, alt = "iPhone Mockup", className = "", onClick }: IPhoneMockupProps) {
  return (
    <div 
      className={`relative inline-block ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* iPhone Frame */}
      <div className="relative bg-black rounded-[3rem] p-3 shadow-2xl" style={{ width: '375px' }}>
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-black rounded-b-3xl z-10" style={{ width: '150px', height: '30px' }}>
          {/* Speaker */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-gray-900 rounded-full" style={{ width: '60px', height: '6px' }}></div>
          {/* Camera */}
          <div className="absolute top-2 right-6 bg-gray-800 rounded-full border border-gray-700" style={{ width: '12px', height: '12px' }}></div>
        </div>

        {/* Screen */}
        <div className="relative bg-white rounded-[2.5rem] overflow-hidden" style={{ aspectRatio: '9/19.5' }}>
          <ImageWithFallback
            src={screenImage}
            alt={alt}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-full" style={{ width: '120px', height: '5px', opacity: 0.3 }}></div>
      </div>
    </div>
  );
}