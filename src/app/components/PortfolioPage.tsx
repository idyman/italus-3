import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Lock, Download } from "lucide-react";
import { useState, useEffect } from "react";
import type { Project, PageSettings } from "../App";

interface PortfolioPageProps {
  projects: Project[];
  pageSettings: PageSettings;
  onAdminClick: () => void;
  onProjectClick?: (project: Project) => void;
  onCVClick?: () => void;
}

export function PortfolioPage({ projects, pageSettings, onAdminClick, onProjectClick, onCVClick }: PortfolioPageProps) {
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [bgImageLoaded, setBgImageLoaded] = useState(false);

  // Preload the background image for faster loading
  useEffect(() => {
    // Only preload if we have a background image URL
    if (!pageSettings.heroBackgroundImage) {
      return;
    }
    
    const bgImageUrl = pageSettings.heroBackgroundImage;
    const img = new Image();
    img.src = bgImageUrl;
    img.onload = () => setBgImageLoaded(true);
    
    // Preload in browser cache with high priority
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = bgImageUrl;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, [pageSettings.heroBackgroundImage]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate form submission - in production, you'd send this to an API
    try {
      // For now, we'll just create a mailto link with the form data
      const subject = encodeURIComponent(`Message from ${contactForm.name}`);
      const body = encodeURIComponent(
        `Name: ${contactForm.name}\nEmail: ${contactForm.email}\n\nMessage:\n${contactForm.message}`
      );
      window.location.href = `mailto:itamardesign@gmail.com?subject=${subject}&body=${body}`;
      
      setSubmitStatus('success');
      setTimeout(() => {
        setShowContactModal(false);
        setContactForm({ name: '', email: '', message: '' });
        setSubmitStatus('idle');
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
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
    <div className="min-h-screen" style={{ backgroundColor: pageSettings.backgroundColor, color: pageSettings.textColor }}>
      {/* Intro Section */}
      <section 
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 relative bg-cover bg-center"
        style={{
          backgroundImage: pageSettings.heroBackgroundImage ? `url(${pageSettings.heroBackgroundImage})` : undefined,
          backgroundColor: pageSettings.heroBackgroundImage ? 'transparent' : '#1a1a1a'
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="w-full max-w-7xl relative z-10"
        >
          <div className="mb-8 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl mb-4">
                <span 
                  className="font-bold block text-white" 
                  style={{ 
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif", 
                    fontSize: 'clamp(80px, 20vw, ' + pageSettings.heroTitleFontSize + ')', 
                    letterSpacing: '-0.02em',
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}
                >
                  Italus.
                </span>
              </h1>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
              <button
                onClick={onCVClick}
                className="inline-flex items-center justify-center gap-3 px-6 py-3 border border-white text-white hover:bg-white hover:text-black transition-colors duration-300 text-base"
              >
                <span className="text-lg">→</span>
                <span>My CV</span>
              </button>
              
              <a
                href="https://www.linkedin.com/in/itamardavidyannay/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-6 py-3 border border-white text-white hover:bg-white hover:text-black transition-colors duration-300 text-base"
              >
                <span className="text-lg">→</span>
                <span>My Linkedin</span>
              </a>
              
              <button
                onClick={() => setShowContactModal(true)}
                className="inline-flex items-center justify-center gap-3 px-6 py-3 border border-white text-white hover:bg-white hover:text-black transition-colors duration-300 text-base"
              >
                <span className="text-lg">→</span>
                <span style={{ fontSize: '17px', lineHeight: 1.4705882353, fontWeight: 400 }}>Say Hi</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Quote Section */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <p 
              className="mb-6 sm:mb-8 leading-relaxed whitespace-pre-wrap"
              style={{
                fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                fontSize: 'clamp(18px, 2.5vw, 24px)',
                fontWeight: 400,
                letterSpacing: '-0.01em',
                lineHeight: 1.5,
                textTransform: 'capitalize'
              }}
            >
              {pageSettings.heroQuote.split('specialization').map((part, i) => 
                i === 0 ? part : <><br key={i} />specialization{part}</>
              )}
            </p>
          </motion.blockquote>
        </div>
      </section>

      {/* Work Section */}
      <section className="px-4 sm:px-6 py-12 sm:py-20" style={{ backgroundColor: pageSettings.backgroundColor }}>
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-6 sm:mb-8"
            style={{
              fontSize: '56px',
              lineHeight: 1.0714285714,
              fontWeight: 600,
              letterSpacing: '-0.02em'
            }}
          >
            Works
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mb-8 sm:mb-12"
          >
            {/* Paragraph removed */}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.length === 0 ? (
              // Placeholder projects
              <>
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.24), ease: [0.22, 0.61, 0.36, 1] }}
                    whileHover={{ y: -4 }}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-[4/3] bg-gray-100 border border-gray-200 mb-4 overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-sm">Project Image</span>
                      </div>
                    </div>
                    <h3 className="text-lg mb-2 group-hover:text-gray-600 transition-colors" style={{ fontWeight: 600 }}>
                      Project Title {index}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Brief description of the decision-leadership project and its strategic impact on the organization.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-gray-100 text-xs">Strategy</span>
                      <span className="px-3 py-1 bg-gray-100 text-xs">Systems</span>
                    </div>
                  </motion.div>
                ))}
              </>
            ) : (
              // Real projects
              projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.24), ease: [0.22, 0.61, 0.36, 1] }}
                  whileHover={{ y: -4 }}
                  onClick={() => onProjectClick?.(project)}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[4/3] bg-gray-100 border border-gray-200 mb-4 overflow-hidden">
                    {project.images && project.images.length > 0 ? (
                      <ImageWithFallback
                        src={project.images[0].url}
                        alt={project.title}
                        className={`${getImageClassName(project.imageFit)} transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]`}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-sm">No Image</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg mb-2 group-hover:text-gray-600 transition-colors duration-200" style={{ fontWeight: 600 }}>
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {project.description}
                  </p>
                  {project.tags && typeof project.tags === 'string' && project.tags.trim() && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.tags.split(',').map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-xs">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-2xl border border-black"
            >
              <div className="flex items-center justify-between p-6 border-b border-black">
                <h2 className="text-2xl">I promise, I will get back to you.</h2>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-2xl hover:text-gray-600 transition-colors leading-none"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-0"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-0"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm mb-2">Message</label>
                    <textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-0 resize-none"
                      rows={6}
                      required
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 border border-black bg-black text-white hover:bg-white hover:text-black transition-colors duration-300 disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowContactModal(false)}
                      className="px-6 py-3 border border-black hover:bg-black hover:text-white transition-colors duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                  {submitStatus === 'success' && (
                    <div className="text-sm text-center">Message sent successfully!</div>
                  )}
                  {submitStatus === 'error' && (
                    <div className="text-sm text-center text-gray-600">Failed to send message. Please try again.</div>
                  )}
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-8 sm:py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs sm:text-sm text-gray-500" style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}>{pageSettings.footerLocation}</p>
        </div>
      </footer>

      {/* Admin Access Button - Fixed to viewport, outside all sections */}
      <button
        onClick={onAdminClick}
        className="fixed bottom-6 right-6 p-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors z-[9999] hover:scale-110 active:scale-95"
        aria-label="Admin Access"
        title="Admin Access"
        style={{ zIndex: 9999 }}
      >
        <Lock className="w-5 h-5" />
      </button>
    </div>
  );
}

export default PortfolioPage;