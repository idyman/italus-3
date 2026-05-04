import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { IPhoneMockup } from "./iPhoneMockup";
import { ArrowLeft, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import type { Project } from "../App";

// Shared motion curve — matches the site-wide ease used in App.tsx and PortfolioPage.
const EASE_OUT = [0.22, 0.61, 0.36, 1] as const;

const sectionFadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: EASE_OUT },
} as const;

interface ProjectDetailPageProps {
  project: Project;
  onBack: () => void;
  onNavigate?: (direction: "prev" | "next") => void;
}

export function ProjectDetailPage({ project, onBack, onNavigate }: ProjectDetailPageProps) {
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Create combined array of all images
  const allImages = [
    ...(project.images || []).map(img => ({ url: img.url, type: 'project' as const })),
    ...(project.mockups || []).map(mockup => ({ url: mockup.imageUrl, type: 'mockup' as const, caption: mockup.title }))
  ];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (fullscreenIndex === null) return;

      if (e.key === 'Escape') {
        setFullscreenIndex(null);
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenIndex]);

  // Handle touch gestures for mobile
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNextImage();
    } else if (isRightSwipe) {
      handlePrevImage();
    }
  };

  const handlePrevImage = () => {
    if (fullscreenIndex === null) return;
    setFullscreenIndex(fullscreenIndex > 0 ? fullscreenIndex - 1 : allImages.length - 1);
  };

  const handleNextImage = () => {
    if (fullscreenIndex === null) return;
    setFullscreenIndex(fullscreenIndex < allImages.length - 1 ? fullscreenIndex + 1 : 0);
  };

  const getImageClassName = (imageFit?: string) => {
    const baseClasses = "w-full h-full";
    switch (imageFit) {
      case "contain":
        return `${baseClasses} object-contain`;
      case "cover-top":
        return `${baseClasses} object-cover object-top`;
      case "cover-center":
        return `${baseClasses} object-cover object-center`;
      case "cover-bottom":
        return `${baseClasses} object-cover object-bottom`;
      default:
        return `${baseClasses} object-cover`;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-gray-600 transition-colors"
            >
              <span>View Live</span>
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </header>

      {/* Hero Image */}
      {project.images && project.images.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          className="aspect-[16/9] bg-gray-100 border-b border-gray-200 cursor-pointer hover:border-gray-400 transition-colors overflow-hidden group"
          onClick={() => setFullscreenIndex(0)}
        >
          <ImageWithFallback
            src={project.images[0].url}
            alt={project.title}
            className={`${getImageClassName(project.imageFit)} transition-transform duration-[600ms] ease-out group-hover:scale-[1.02]`}
          />
        </motion.div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.1 }}
        >
          {/* Title */}
          <h1 
            className="mb-6"
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif",
              fontSize: '48px',
              lineHeight: 1.2,
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}
          >
            {project.title}
          </h1>

          {/* Description */}
          <p 
            className="mb-8 text-gray-600 leading-relaxed"
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
              fontSize: '18px',
              lineHeight: 1.6
            }}
          >
            {project.description}
          </p>

          {/* Tags */}
          {project.tags && typeof project.tags === 'string' && project.tags.trim() && (
            <div className="mb-12 flex flex-wrap gap-2">
              {project.tags.split(',').map((tag, i) => (
                <span key={i} className="px-4 py-2 bg-gray-100 text-sm">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Detailed Text */}
          {project.detailedText && (
            <div 
              className="prose prose-lg max-w-none mb-12"
              style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif"
              }}
            >
              <p className="whitespace-pre-wrap">{project.detailedText}</p>
            </div>
          )}

          {/* Additional Images */}
          {project.images && project.images.length > 1 && (
            <div className="space-y-8">
              {project.images.slice(1).map((image, index) => (
                <motion.div
                  key={image.url + index}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.2), ease: EASE_OUT }}
                  className="aspect-[16/9] bg-gray-100 border border-gray-200 cursor-pointer hover:border-gray-400 transition-colors overflow-hidden group"
                  onClick={() => setFullscreenIndex(index + 1)}
                >
                  <ImageWithFallback
                    src={image.url}
                    alt={`${project.title} - Image ${index + 2}`}
                    className={`${getImageClassName(project.imageFit)} transition-transform duration-[600ms] ease-out group-hover:scale-[1.02]`}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Colors */}
          {project.colors && project.colors.length > 0 && (
            <motion.div className="mt-12" {...sectionFadeIn}>
              <h2 
                className="mb-4"
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif",
                  fontSize: '24px',
                  fontWeight: 600,
                  letterSpacing: '-0.01em'
                }}
              >
                Color Palette
              </h2>
              <div className="flex gap-4">
                {project.colors.map((color, index) => (
                  <div key={color + index} className="flex-1">
                    <div
                      className="aspect-square border border-gray-200 mb-2"
                      style={{ backgroundColor: color }}
                    />
                    <p className="text-xs text-gray-600 text-center">{color}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Typography */}
          {project.typography && project.typography.length > 0 && (
            <motion.div className="mt-12" {...sectionFadeIn}>
              <h2 
                className="mb-4"
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif",
                  fontSize: '24px',
                  fontWeight: 600,
                  letterSpacing: '-0.01em'
                }}
              >
                Typography
              </h2>
              <div className="space-y-6">
                {project.typography.map((item, index) => (
                  <div key={(item.fontFamily || "font") + index} className="border border-gray-200 p-6">
                    <p
                      style={{
                        fontFamily: item.fontFamily,
                        fontSize: item.fontSize,
                        fontWeight: item.fontWeight,
                        lineHeight: item.lineHeight,
                        letterSpacing: item.letterSpacing
                      }}
                    >
                      {item.text || "The quick brown fox jumps over the lazy dog"}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                      {item.fontFamily} • {item.fontSize} • {item.fontWeight}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Logos */}
          {project.logos && project.logos.length > 0 && (
            <motion.div className="mt-12" {...sectionFadeIn}>
              <h2 
                className="mb-4"
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif",
                  fontSize: '24px',
                  fontWeight: 600,
                  letterSpacing: '-0.01em'
                }}
              >
                Logos
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {project.logos.map((logo, index) => (
                  <div
                    key={logo.url + index}
                    className="border border-gray-200 p-6 flex items-center justify-center bg-gray-50 transition-all duration-300 hover:border-gray-400 hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    <ImageWithFallback
                      src={logo.url}
                      alt={`Logo ${index + 1}`}
                      className="max-w-full max-h-32 object-contain"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Mockups */}
          {project.mockups && project.mockups.length > 0 && (
            <motion.div className="mt-12" {...sectionFadeIn}>
              <h2 
                className="mb-4"
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif",
                  fontSize: '24px',
                  fontWeight: 600,
                  letterSpacing: '-0.01em'
                }}
              >
                Mockups
              </h2>
              <div className="flex flex-wrap gap-8 justify-center">
                {project.mockups.map((mockup, index) => (
                  <motion.div
                    key={mockup.id || mockup.imageUrl + index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.32), ease: EASE_OUT }}
                    className="flex flex-col items-center"
                  >
                    <IPhoneMockup
                      screenImage={mockup.imageUrl}
                      alt={mockup.title || `Mockup ${index + 1}`}
                      onClick={() => setFullscreenIndex(project.images ? project.images.length + index : index)}
                    />
                    {mockup.title && (
                      <p className="mt-4 text-sm text-gray-600 text-center max-w-xs">{mockup.title}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Motion/Video */}
          {project.motion && project.motion.length > 0 && (
            <motion.div className="mt-12" {...sectionFadeIn}>
              <h2 
                className="mb-4"
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif",
                  fontSize: '24px',
                  fontWeight: 600,
                  letterSpacing: '-0.01em'
                }}
              >
                Motion & Video
              </h2>
              <div className="space-y-6">
                {project.motion.map((item, index) => (
                  <div key={(item.url || "motion") + index}>
                    {item.type === 'video' && item.url && (
                      <div className="aspect-video">
                        {item.url.includes('figma.com') ? (
                          <iframe
                            src={item.url}
                            className="w-full h-full border border-gray-200"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            src={item.url}
                            controls
                            className="w-full h-full border border-gray-200"
                          />
                        )}
                      </div>
                    )}
                    {item.caption && (
                      <p className="mt-4 text-sm text-gray-600">{item.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Case Study */}
          {project.caseStudy && (
            <motion.div className="mt-12 border-t border-gray-200 pt-12" {...sectionFadeIn}>
              <h2 
                className="mb-6"
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif",
                  fontSize: '32px',
                  fontWeight: 600,
                  letterSpacing: '-0.01em'
                }}
              >
                Case Study
              </h2>
              
              {project.caseStudy.challenge && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-3">Challenge</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {project.caseStudy.challenge}
                  </p>
                </div>
              )}
              
              {project.caseStudy.solution && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-3">Solution</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {project.caseStudy.solution}
                  </p>
                </div>
              )}
              
              {project.caseStudy.outcome && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-3">Outcome</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {project.caseStudy.outcome}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Navigation */}
      {onNavigate && (
        <div className="border-t border-gray-200 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 flex justify-between">
            <button
              onClick={() => onNavigate("prev")}
              className="text-gray-600 hover:text-black transition-colors"
            >
              ← Previous Project
            </button>
            <button
              onClick={() => onNavigate("next")}
              className="text-gray-600 hover:text-black transition-colors"
            >
              Next Project →
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Image Gallery */}
      {fullscreenIndex !== null && allImages[fullscreenIndex] && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Close Button */}
          <button
            onClick={() => setFullscreenIndex(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 border border-white text-white hover:bg-white hover:bg-opacity-10 p-2 sm:p-3 rounded-full transition-colors z-10"
            aria-label="Close fullscreen"
          >
            <X size={24} className="sm:w-6 sm:h-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg text-sm sm:text-base z-10">
            {fullscreenIndex + 1} / {allImages.length}
          </div>

          {/* HD Image Display (1920x1080) */}
          <div 
            className="relative w-full h-full flex items-center justify-center"
            style={{ maxWidth: '1920px', maxHeight: '1080px' }}
          >
            <ImageWithFallback
              src={allImages[fullscreenIndex].url}
              alt={`Image ${fullscreenIndex + 1}`}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Caption for mockups */}
          {allImages[fullscreenIndex].type === 'mockup' && allImages[fullscreenIndex].caption && (
            <div className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg max-w-2xl text-center text-sm sm:text-base">
              {allImages[fullscreenIndex].caption}
            </div>
          )}

          {/* Bottom Navigation Bar */}
          {allImages.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 backdrop-blur-sm z-10">
              <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 flex items-center justify-between gap-4">
                <button
                  onClick={handlePrevImage}
                  className="flex items-center gap-2 text-white hover:bg-white hover:bg-opacity-10 px-4 sm:px-6 py-2 sm:py-3 rounded transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
                  <span className="hidden sm:inline text-sm sm:text-base">Previous</span>
                </button>

                {/* Mobile Swipe Indicator */}
                <div className="sm:hidden text-white text-opacity-60 px-3 py-2 text-xs">
                  ← Swipe →
                </div>

                <button
                  onClick={handleNextImage}
                  className="flex items-center gap-2 text-white hover:bg-white hover:bg-opacity-10 px-4 sm:px-6 py-2 sm:py-3 rounded transition-colors"
                  aria-label="Next image"
                >
                  <span className="hidden sm:inline text-sm sm:text-base">Next</span>
                  <ChevronRight size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default ProjectDetailPage;