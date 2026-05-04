import type { Project, PageSettings, ProjectImage, TypographyItem, MotionItem, MockupItem, CustomSection, CaseStudy } from "../App";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { LogOut, Plus, Pencil, Trash2, X, Save } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ProjectImageManager } from "./ProjectImageManager";
import { HeroImageManager } from "./HeroImageManager";
import { LogoManager } from "./LogoManager";
import { TypographyManager } from "./TypographyManager";
import { MotionManager } from "./MotionManager";
import { MockupManager } from "./admin/MockupManager";
import { CaseStudyManager } from "./admin/CaseStudyManager";
import { CVUploader } from "./admin/CVUploader";
import { ImageUrlHelper } from "./admin/ImageUrlHelper";
import { toast } from "sonner";

interface AdminDashboardProps {
  projects: Project[];
  onLogout: () => void;
  onAddProject: (project: Omit<Project, "id">) => void;
  onUpdateProject: (id: string, project: Omit<Project, "id">) => void;
  onDeleteProject: (id: string) => void;
  pageSettings: PageSettings;
  onUpdatePageSettings: (settings: PageSettings) => void;
}

type TabType = "projects" | "settings";

export function AdminDashboard({
  projects,
  onLogout,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  pageSettings,
  onUpdatePageSettings,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("projects");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [signedInEmail, setSignedInEmail] = useState<string | null>(auth.currentUser?.email ?? null);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => setSignedInEmail(user?.email ?? null));
  }, []);

  // Project form data
  const [projectFormData, setProjectFormData] = useState({
    title: "",
    description: "",
    detailedText: "",
    tags: "",
    link: "",
    gridSize: "medium" as "small" | "medium" | "large",
    imageFit: "cover" as "cover" | "contain" | "cover-top" | "cover-center" | "cover-bottom",
    images: [] as ProjectImage[],
    colors: [] as string[],
    logos: [] as ProjectImage[],
    typography: [] as TypographyItem[],
    motion: [] as MotionItem[],
    mockups: [] as MockupItem[],
    caseStudy: undefined as CaseStudy | undefined,
  });

  // Project handlers
  const submitProject = () => {
    const title = projectFormData.title.trim();
    const description = projectFormData.description.trim();
    const parsedTags = projectFormData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (!title) {
      toast.error("Project title is required");
      return;
    }
    if (!description) {
      toast.error("Short description is required");
      return;
    }
    if (parsedTags.length === 0) {
      toast.error("Add at least one tag");
      return;
    }

    const projectData = {
      title,
      description,
      detailedText: projectFormData.detailedText,
      tags: parsedTags,
      link: projectFormData.link || undefined,
      gridSize: projectFormData.gridSize,
      imageFit: projectFormData.imageFit,
      images: projectFormData.images,
      colors: projectFormData.colors,
      logos: projectFormData.logos,
      typography: projectFormData.typography,
      motion: projectFormData.motion,
      mockups: projectFormData.mockups,
      caseStudy: projectFormData.caseStudy,
    };

    if (editingProject) {
      onUpdateProject(editingProject.id, projectData);
      toast.success("Project updated");
    } else {
      onAddProject(projectData);
      toast.success("Project created");
    }
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitProject();
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectFormData({
      title: project.title,
      description: project.description,
      detailedText: project.detailedText || "",
      tags: project.tags.join(", "),
      link: project.link || "",
      gridSize: project.gridSize || "medium",
      imageFit: project.imageFit || "cover",
      images: project.images || [],
      colors: project.colors || [],
      logos: project.logos || [],
      typography: project.typography || [],
      motion: project.motion || [],
      mockups: project.mockups || [],
      caseStudy: project.caseStudy || undefined,
    });
    setIsFormOpen(true);
  };

  const resetProjectForm = () => {
    setProjectFormData({
      title: "",
      description: "",
      detailedText: "",
      tags: "",
      link: "",
      gridSize: "medium",
      imageFit: "cover",
      images: [],
      colors: [],
      logos: [],
      typography: [],
      motion: [],
      mockups: [],
      caseStudy: undefined,
    });
    setEditingProject(null);
    setIsFormOpen(false);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setIsFormOpen(false);
    resetProjectForm();
  };

  // CV URL Handler - Users paste CV URL instead of uploading
  const handleCVUrlUpdate = (url: string) => {
    onUpdatePageSettings({ ...pageSettings, cvUrl: url });
    toast.success('CV URL updated successfully!');
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex justify-between items-center">
          <h1 
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif",
              fontSize: '28px',
              lineHeight: 1.2,
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}
          >
            Admin Dashboard
          </h1>
          <div className="flex gap-3 items-center">
            <div
              className={`px-3 py-2 rounded-md border-2 text-xs font-medium ${
                signedInEmail
                  ? "bg-green-50 border-green-300 text-green-800"
                  : "bg-red-50 border-red-300 text-red-800"
              }`}
              style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif" }}
              title="The email Firebase Storage/Firestore rules see"
            >
              {signedInEmail ? (
                <>
                  <span className="opacity-60 mr-1">Signed in:</span>
                  <span className="font-semibold">{signedInEmail}</span>
                </>
              ) : (
                "⚠️ Not signed in — uploads will fail"
              )}
            </div>
            <button
              onClick={() => {
                window.location.href = window.location.origin;
              }}
              className="px-6 py-2.5 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all rounded-md"
              style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                fontSize: '15px',
                fontWeight: 500,
                letterSpacing: '-0.01em'
              }}
            >
              View Portfolio
            </button>
            <button 
              onClick={onLogout}
              className="px-6 py-2.5 bg-black text-white border-2 border-black hover:bg-gray-900 transition-all flex items-center gap-2 rounded-md"
              style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                fontSize: '15px',
                fontWeight: 500,
                letterSpacing: '-0.01em'
              }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="mb-10 flex gap-2 border-b-2 border-gray-200 bg-white rounded-t-lg overflow-hidden">
          <button
            onClick={() => handleTabChange("projects")}
            className={`px-8 py-4 border-b-4 transition-all ${
              activeTab === "projects"
                ? "border-black text-black bg-gray-50 font-semibold"
                : "border-transparent text-gray-500 hover:text-black hover:bg-gray-50"
            }`}
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
              fontSize: '16px',
              fontWeight: activeTab === "projects" ? 600 : 400,
              letterSpacing: '-0.01em'
            }}
          >
            Projects <span className="ml-2 px-2 py-0.5 bg-gray-200 rounded-full text-xs">{projects.length}</span>
          </button>
          <button
            onClick={() => handleTabChange("settings")}
            className={`px-8 py-4 border-b-4 transition-all ${
              activeTab === "settings"
                ? "border-black text-black bg-gray-50 font-semibold"
                : "border-transparent text-gray-500 hover:text-black hover:bg-gray-50"
            }`}
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
              fontSize: '16px',
              fontWeight: activeTab === "settings" ? 600 : 400,
              letterSpacing: '-0.01em'
            }}
          >
            Page Settings
          </button>
        </div>

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <>
            {/* Add Project Button */}
            <div className="mb-8">
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-8 py-4 bg-black text-white hover:bg-gray-900 transition-all flex items-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-black rounded-md shadow-md hover:shadow-lg"
                disabled={isFormOpen}
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                  fontSize: '16px',
                  fontWeight: 600,
                  letterSpacing: '-0.01em'
                }}
              >
                <Plus size={20} strokeWidth={2.5} />
                Add New Project
              </button>
            </div>

            {/* Project Form */}
            {isFormOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <div className="border-2 border-gray-300 rounded-lg p-10 bg-white shadow-xl">
                  <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-gray-200">
                    <div>
                      <h2
                        className="mb-2"
                        style={{
                          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif",
                          fontSize: '26px',
                          lineHeight: 1.2,
                          fontWeight: 700,
                          letterSpacing: '-0.02em'
                        }}
                      >
                        {editingProject ? "Edit Project" : "Create New Project"}
                      </h2>
                      <p style={{
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                        fontSize: '14px',
                        color: '#666',
                        letterSpacing: '-0.01em'
                      }}>
                        {editingProject ? "Update your project details and save when finished" : "Fill in all the required information for your new project"}
                      </p>
                    </div>
                    <button 
                      onClick={resetProjectForm}
                      className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                      title="Close form"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <form id="project-form" onSubmit={handleProjectSubmit} className="space-y-10">
                    {/* SECTION: Basic Information */}
                    <div className="space-y-5">
                      <h3 style={{
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                        fontSize: '18px',
                        fontWeight: 600,
                        letterSpacing: '-0.01em',
                        color: '#000',
                        borderBottom: '2px solid #e5e7eb',
                        paddingBottom: '8px'
                      }}>
                        Basic Information
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="title" className="text-sm font-semibold mb-2 block">Project Title *</Label>
                          <Input
                            id="title"
                            value={projectFormData.title}
                            onChange={(e) =>
                              setProjectFormData({ ...projectFormData, title: e.target.value })
                            }
                            placeholder="Enter project name"
                            className="text-base"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="link" className="text-sm font-semibold mb-2 block">Project Link (Optional)</Label>
                          <Input
                            id="link"
                            value={projectFormData.link}
                            onChange={(e) =>
                              setProjectFormData({ ...projectFormData, link: e.target.value })
                            }
                            placeholder="https://project-url.com"
                            className="text-base"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description" className="text-sm font-semibold mb-2 block">Short Description *</Label>
                        <Textarea
                          id="description"
                          value={projectFormData.description}
                          onChange={(e) =>
                            setProjectFormData({ ...projectFormData, description: e.target.value })
                          }
                          placeholder="Brief description for project card"
                          rows={3}
                          className="text-base"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="detailedText" className="text-sm font-semibold mb-2 block">Detailed Description</Label>
                        <Textarea
                          id="detailedText"
                          value={projectFormData.detailedText}
                          onChange={(e) =>
                            setProjectFormData({ ...projectFormData, detailedText: e.target.value })
                          }
                          placeholder="Full project description for the detail page..."
                          rows={6}
                          className="text-base"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          This text appears on the project detail page
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="tags" className="text-sm font-semibold mb-2 block">Tags *</Label>
                        <Input
                          id="tags"
                          value={projectFormData.tags}
                          onChange={(e) =>
                            setProjectFormData({ ...projectFormData, tags: e.target.value })
                          }
                          placeholder="React, Design, Web Development"
                          className="text-base"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Separate tags with commas
                        </p>
                      </div>
                    </div>

                    {/* SECTION: Images & Media */}
                    <div className="space-y-5 pt-6 border-t-2 border-gray-200">
                      <h3 style={{
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                        fontSize: '18px',
                        fontWeight: 600,
                        letterSpacing: '-0.01em',
                        color: '#000',
                        borderBottom: '2px solid #e5e7eb',
                        paddingBottom: '8px'
                      }}>
                        Images & Media
                      </h3>

                      {/* Multi-Image Manager */}
                      <div>
                        <Label className="text-sm font-semibold mb-3 block">
                          Project Images (up to 10)
                          {projectFormData.images.length > 0 && (
                            <span className="ml-3 text-sm font-normal text-green-600 bg-green-50 px-3 py-1 rounded-full">
                              ✓ {projectFormData.images.length} image{projectFormData.images.length !== 1 ? 's' : ''} added
                            </span>
                          )}
                        </Label>
                        <ImageUrlHelper />
                        <ProjectImageManager
                          images={projectFormData.images}
                          onChange={(images) => {
                            console.log('🔄 [AdminDashboard] Images updated in form:', images);
                            console.log('🔄 [AdminDashboard] Before state update:', projectFormData.images);
                            const newFormData = { ...projectFormData, images };
                            console.log('🔄 [AdminDashboard] New form data:', newFormData);
                            setProjectFormData(newFormData);
                            console.log('✅ [AdminDashboard] State update called');
                          }}
                        />
                      </div>

                      {/* Mockup Manager */}
                      <div>
                        <Label className="text-sm font-semibold mb-3 block">
                          Mockups (Optional)
                          {projectFormData.mockups.length > 0 && (
                            <span className="ml-3 text-sm font-normal text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                              ✓ {projectFormData.mockups.length} mockup{projectFormData.mockups.length !== 1 ? 's' : ''} added
                            </span>
                          )}
                        </Label>
                        <MockupManager
                          mockups={projectFormData.mockups}
                          onChange={(mockups) => {
                            console.log('🔄 Mockups updated in form:', mockups);
                            setProjectFormData({ ...projectFormData, mockups });
                          }}
                        />
                      </div>
                    </div>

                    {/* SECTION: Design Elements */}
                    <div className="space-y-5 pt-6 border-t-2 border-gray-200">
                      <h3 style={{
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                        fontSize: '18px',
                        fontWeight: 600,
                        letterSpacing: '-0.01em',
                        color: '#000',
                        borderBottom: '2px solid #e5e7eb',
                        paddingBottom: '8px'
                      }}>
                        Design Elements
                      </h3>

                      {/* Color Palette Manager */}
                      <div>
                        <Label className="text-sm font-semibold mb-3 block">Color Palette</Label>
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-3">
                            {projectFormData.colors.map((color, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 p-3 border-2 border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors"
                              >
                                <div
                                  className="w-12 h-12 rounded-md border-2 border-gray-300 shadow-sm"
                                  style={{ backgroundColor: color }}
                                />
                                <Input
                                  type="text"
                                  value={color}
                                  onChange={(e) => {
                                    const newColors = [...projectFormData.colors];
                                    newColors[index] = e.target.value;
                                    setProjectFormData({ ...projectFormData, colors: newColors });
                                  }}
                                  placeholder="#000000"
                                  className="w-32 text-base"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const newColors = projectFormData.colors.filter((_, i) => i !== index);
                                    setProjectFormData({ ...projectFormData, colors: newColors });
                                  }}
                                  className="hover:bg-red-50 hover:text-red-600"
                                >
                                  <X size={18} />
                                </Button>
                              </div>
                            ))}
                          </div>
                          {projectFormData.colors.length < 10 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setProjectFormData({
                                  ...projectFormData,
                                  colors: [...projectFormData.colors, "#000000"],
                                });
                              }}
                              className="gap-2 border-2"
                            >
                              <Plus size={18} />
                              Add Color
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Logo Manager */}
                      <div>
                        <Label className="text-sm font-semibold mb-3 block">Logos (Optional)</Label>
                        <LogoManager
                          logos={projectFormData.logos}
                          onChange={(logos) =>
                            setProjectFormData({ ...projectFormData, logos })
                          }
                        />
                      </div>

                      {/* Typography Manager */}
                      <div>
                        <Label className="text-sm font-semibold mb-3 block">Typography (Optional)</Label>
                        <TypographyManager
                          typography={projectFormData.typography}
                          onChange={(typography) =>
                            setProjectFormData({ ...projectFormData, typography })
                          }
                        />
                      </div>

                      {/* Motion Manager */}
                      <div>
                        <Label className="text-sm font-semibold mb-3 block">Motion (Optional)</Label>
                        <MotionManager
                          motion={projectFormData.motion}
                          onChange={(motion) =>
                            setProjectFormData({ ...projectFormData, motion })
                          }
                        />
                      </div>
                    </div>

                    {/* SECTION: Case Study */}
                    <div className="space-y-5 pt-6 border-t-2 border-gray-200">
                      <h3 style={{
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                        fontSize: '18px',
                        fontWeight: 600,
                        letterSpacing: '-0.01em',
                        color: '#000',
                        borderBottom: '2px solid #e5e7eb',
                        paddingBottom: '8px'
                      }}>
                        Case Study (Optional)
                      </h3>

                      <CaseStudyManager
                        caseStudy={projectFormData.caseStudy}
                        onChange={(caseStudy) =>
                          setProjectFormData({ ...projectFormData, caseStudy })
                        }
                      />
                    </div>

                    {/* SECTION: Display Settings */}
                    <div className="space-y-5 pt-6 border-t-2 border-gray-200">
                      <h3 style={{
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                        fontSize: '18px',
                        fontWeight: 600,
                        letterSpacing: '-0.01em',
                        color: '#000',
                        borderBottom: '2px solid #e5e7eb',
                        paddingBottom: '8px'
                      }}>
                        Display Settings
                      </h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="gridSize" className="text-sm font-semibold mb-2 block">Grid Size</Label>
                          <select
                            id="gridSize"
                            value={projectFormData.gridSize}
                            onChange={(e) =>
                              setProjectFormData({ ...projectFormData, gridSize: e.target.value as "small" | "medium" | "large" })
                            }
                            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-md focus:outline-none focus:border-black transition-colors text-base"
                            style={{
                              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif"
                            }}
                          >
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="imageFit" className="text-sm font-semibold mb-2 block">Image Fit</Label>
                          <select
                            id="imageFit"
                            value={projectFormData.imageFit}
                            onChange={(e) =>
                              setProjectFormData({ ...projectFormData, imageFit: e.target.value as "cover" | "contain" | "cover-top" | "cover-center" | "cover-bottom" })
                            }
                            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-md focus:outline-none focus:border-black transition-colors text-base"
                            style={{
                              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif"
                            }}
                          >
                            <option value="cover">Cover</option>
                            <option value="contain">Contain</option>
                            <option value="cover-top">Cover Top</option>
                            <option value="cover-center">Cover Center</option>
                            <option value="cover-bottom">Cover Bottom</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4 pt-8 border-t-2 border-gray-200">
                      <button 
                        type="submit"
                        className="px-10 py-4 bg-black text-white hover:bg-gray-900 transition-all rounded-md shadow-md hover:shadow-lg font-semibold"
                        style={{
                          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                          fontSize: '16px',
                          letterSpacing: '-0.01em'
                        }}
                      >
                        {editingProject ? "Save Changes" : "Create Project"}
                      </button>
                      <button 
                        type="button"
                        onClick={resetProjectForm}
                        className="px-10 py-4 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all rounded-md font-medium"
                        style={{
                          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                          fontSize: '16px',
                          letterSpacing: '-0.01em'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>

                  {/* Sticky Floating Save Button */}
                  <div className="fixed bottom-8 right-8 z-50 flex gap-3">
                    <button 
                      type="button"
                      onClick={resetProjectForm}
                      className="px-6 py-3.5 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-xl rounded-md font-medium"
                      style={{
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                        fontSize: '15px',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      form="project-form"
                      className="px-8 py-3.5 bg-black text-white hover:bg-gray-900 transition-all shadow-xl hover:shadow-2xl flex items-center gap-3 rounded-md font-semibold"
                      style={{
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                        fontSize: '15px',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      <Save className="w-5 h-5" />
                      {editingProject ? "Save Changes" : "Save Project"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Projects List */}
            <div>
              <h2 
                className="mb-6"
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif",
                  fontSize: '22px',
                  lineHeight: 1.3,
                  fontWeight: 700,
                  letterSpacing: '-0.02em'
                }}
              >
                Your Projects <span className="text-gray-400 font-normal">({projects.length})</span>
              </h2>

              {projects.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-16 text-center bg-white">
                  <p style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                    fontSize: '16px',
                    color: '#999',
                    marginBottom: '16px'
                  }}>
                    No projects yet
                  </p>
                  <p style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                    fontSize: '14px',
                    color: '#aaa'
                  }}>
                    Click "Add New Project" to create your first project
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all bg-white">
                        <div className="aspect-video bg-gray-100 overflow-hidden">
                          <ImageWithFallback
                            src={project.images?.[0]?.url || ""}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-5">
                          <h3 
                            className="mb-2"
                            style={{
                              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                              fontSize: '17px',
                              fontWeight: 600,
                              letterSpacing: '-0.01em'
                            }}
                          >
                            {project.title}
                          </h3>
                          <p 
                            className="mb-4 line-clamp-2"
                            style={{
                              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                              fontSize: '14px',
                              color: '#666',
                              lineHeight: 1.5
                            }}
                          >
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                                style={{
                                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif"
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditProject(project)}
                              className="flex-1 px-4 py-2.5 border-2 border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all flex items-center gap-2 justify-center font-medium rounded-md"
                              style={{
                                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                                fontSize: '14px'
                              }}
                            >
                              <Pencil size={16} />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    "Are you sure you want to delete this project? This action cannot be undone."
                                  )
                                ) {
                                  onDeleteProject(project.id);
                                }
                              }}
                              className="px-4 py-2.5 border-2 border-red-200 text-red-600 hover:border-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center gap-2 rounded-md"
                              style={{
                                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                                fontSize: '14px'
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <>
            <div className="border-2 border-gray-300 rounded-lg p-10 max-w-4xl bg-white shadow-lg">
              <div className="mb-8">
                <h2 
                  className="mb-3"
                  style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif",
                    fontSize: '26px',
                    lineHeight: 1.2,
                    fontWeight: 700,
                    letterSpacing: '-0.02em'
                  }}
                >
                  Page Settings
                </h2>
                <p 
                  style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                    fontSize: '15px',
                    color: '#666',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Customize your portfolio's appearance, content, and branding.
                </p>
              </div>
              
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className="space-y-10"
              >
                {/* Hero Section */}
                <div className="pb-8 border-b-2 border-gray-200">
                  <h3 
                    className="mb-5"
                    style={{
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                      fontSize: '18px',
                      fontWeight: 600,
                      letterSpacing: '-0.01em'
                    }}
                  >
                    Hero Section
                  </h3>

                  {/* Hero Preview */}
                  <div className="mb-6">
                    <Label className="mb-3 block text-sm font-semibold">Live Preview</Label>
                    <div 
                      className="relative border-2 border-gray-300 rounded-lg overflow-hidden"
                      style={{
                        minHeight: '300px',
                        backgroundColor: pageSettings.heroBackgroundImage ? 'transparent' : '#f9fafb'
                      }}
                    >
                      {/* Background Image */}
                      {pageSettings.heroBackgroundImage && (
                        <div className="absolute inset-0">
                          <ImageWithFallback
                            src={pageSettings.heroBackgroundImage}
                            alt="Hero background preview"
                            className="w-full h-full object-cover"
                          />
                          {/* Overlay for better text readability */}
                          <div className="absolute inset-0 bg-black/20"></div>
                        </div>
                      )}
                      
                      {/* Hero Content Preview */}
                      <div className="relative z-10 flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
                        {/* Preview shows background image only */}
                      </div>
                      
                      {/* Preview Label */}
                      <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1.5 rounded-md text-xs font-medium">
                        Preview (scaled)
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      This preview shows how your hero section will appear on the live site
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="hero-title" className="text-sm font-semibold mb-2 block">Hero Title</Label>
                      <Input
                        id="hero-title"
                        value={pageSettings.heroTitle}
                        onChange={(e) =>
                          onUpdatePageSettings({ ...pageSettings, heroTitle: e.target.value })
                        }
                        placeholder="ITALUS"
                        className="text-base"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="hero-font-size" className="text-sm font-semibold mb-2 block">Hero Title Font Size</Label>
                      <Input
                        id="hero-font-size"
                        value={pageSettings.heroTitleFontSize}
                        onChange={(e) =>
                          onUpdatePageSettings({ ...pageSettings, heroTitleFontSize: e.target.value })
                        }
                        placeholder="204px"
                        className="text-base"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Enter size with units (e.g., 204px, 12rem, 5vw)
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-semibold mb-2 block">Hero Background Image</Label>
                      <HeroImageManager
                        imageUrl={pageSettings.heroBackgroundImage}
                        onChange={(url) =>
                          onUpdatePageSettings({ ...pageSettings, heroBackgroundImage: url })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="hero-quote" className="text-sm font-semibold mb-2 block">Hero Quote</Label>
                      <Textarea
                        id="hero-quote"
                        value={pageSettings.heroQuote || ''}
                        onChange={(e) =>
                          onUpdatePageSettings({ ...pageSettings, heroQuote: e.target.value })
                        }
                        placeholder="Your inspiring quote here..."
                        rows={6}
                        className="text-base"
                      />
                    </div>
                  </div>
                </div>

                {/* Section Settings */}
                <div className="pb-8 border-b-2 border-gray-200">
                  <h3 
                    className="mb-5"
                    style={{
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                      fontSize: '18px',
                      fontWeight: 600,
                      letterSpacing: '-0.01em'
                    }}
                  >
                    Section Settings
                  </h3>
                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="work-title" className="text-sm font-semibold mb-2 block">Work Section Title</Label>
                      <Input
                        id="work-title"
                        value={pageSettings.workSectionTitle}
                        onChange={(e) =>
                          onUpdatePageSettings({ ...pageSettings, workSectionTitle: e.target.value })
                        }
                        placeholder="Selected Work"
                        className="text-base"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Sections */}
                <div className="pb-8 border-b-2 border-gray-200">
                  <div className="flex items-center justify-between mb-5">
                    <h3 
                      style={{
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                        fontSize: '18px',
                        fontWeight: 600,
                        letterSpacing: '-0.01em'
                      }}
                    >
                      Custom Sections
                    </h3>
                    <Button
                      type="button"
                      onClick={() => {
                        const newSection = {
                          id: Date.now().toString(),
                          title: 'New Section',
                          description: 'Section description',
                          order: (pageSettings.customSections || []).length,
                        };
                        onUpdatePageSettings({
                          ...pageSettings,
                          customSections: [...(pageSettings.customSections || []), newSection],
                        });
                      }}
                      size="sm"
                      className="gap-2 border-2 font-semibold"
                    >
                      <Plus className="w-4 h-4" />
                      Add Section
                    </Button>
                  </div>
                  
                  {(!pageSettings.customSections || pageSettings.customSections.length === 0) ? (
                    <p className="text-sm text-gray-500 italic py-6 text-center border-2 border-dashed border-gray-200 rounded-lg">
                      No custom sections yet. Click "Add Section" to create one.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {pageSettings.customSections
                        .sort((a, b) => a.order - b.order)
                        .map((section, index) => (
                        <Card key={section.id} className="p-5 border-2">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-semibold">Section {index + 1}</Label>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  onUpdatePageSettings({
                                    ...pageSettings,
                                    customSections: pageSettings.customSections?.filter(
                                      (s) => s.id !== section.id
                                    ),
                                  });
                                }}
                                className="hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div>
                              <Label htmlFor={`section-title-${section.id}`} className="text-sm font-semibold mb-2 block">Title</Label>
                              <Input
                                id={`section-title-${section.id}`}
                                value={section.title}
                                onChange={(e) => {
                                  onUpdatePageSettings({
                                    ...pageSettings,
                                    customSections: pageSettings.customSections?.map((s) =>
                                      s.id === section.id ? { ...s, title: e.target.value } : s
                                    ),
                                  });
                                }}
                                placeholder="Section Title"
                                className="text-base"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`section-desc-${section.id}`} className="text-sm font-semibold mb-2 block">Description</Label>
                              <Textarea
                                id={`section-desc-${section.id}`}
                                value={section.description}
                                onChange={(e) => {
                                  onUpdatePageSettings({
                                    ...pageSettings,
                                    customSections: pageSettings.customSections?.map((s) =>
                                      s.id === section.id ? { ...s, description: e.target.value } : s
                                    ),
                                  });
                                }}
                                placeholder="Section description..."
                                rows={3}
                                className="text-base"
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Color Settings */}
                <div className="pb-8 border-b-2 border-gray-200">
                  <h3 
                    className="mb-5"
                    style={{
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                      fontSize: '18px',
                      fontWeight: 600,
                      letterSpacing: '-0.01em'
                    }}
                  >
                    Color Settings
                  </h3>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="bg-color" className="text-sm font-semibold mb-2 block">Background Color</Label>
                      <div className="flex gap-3">
                        <Input
                          id="bg-color"
                          type="color"
                          value={pageSettings.backgroundColor}
                          onChange={(e) =>
                            onUpdatePageSettings({ ...pageSettings, backgroundColor: e.target.value })
                          }
                          className="w-20 h-12 cursor-pointer"
                        />
                        <Input
                          value={pageSettings.backgroundColor}
                          onChange={(e) =>
                            onUpdatePageSettings({ ...pageSettings, backgroundColor: e.target.value })
                          }
                          placeholder="#ffffff"
                          className="text-base"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="text-color" className="text-sm font-semibold mb-2 block">Text Color</Label>
                      <div className="flex gap-3">
                        <Input
                          id="text-color"
                          type="color"
                          value={pageSettings.textColor}
                          onChange={(e) =>
                            onUpdatePageSettings({ ...pageSettings, textColor: e.target.value })
                          }
                          className="w-20 h-12 cursor-pointer"
                        />
                        <Input
                          value={pageSettings.textColor}
                          onChange={(e) =>
                            onUpdatePageSettings({ ...pageSettings, textColor: e.target.value })
                          }
                          placeholder="#000000"
                          className="text-base"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="accent-color" className="text-sm font-semibold mb-2 block">Accent Color</Label>
                      <div className="flex gap-3">
                        <Input
                          id="accent-color"
                          type="color"
                          value={pageSettings.accentColor}
                          onChange={(e) =>
                            onUpdatePageSettings({ ...pageSettings, accentColor: e.target.value })
                          }
                          className="w-20 h-12 cursor-pointer"
                        />
                        <Input
                          value={pageSettings.accentColor}
                          onChange={(e) =>
                            onUpdatePageSettings({ ...pageSettings, accentColor: e.target.value })
                          }
                          placeholder="#000000"
                          className="text-base"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="section-bg-color" className="text-sm font-semibold mb-2 block">Section Background Color</Label>
                      <div className="flex gap-3">
                        <Input
                          id="section-bg-color"
                          type="color"
                          value={pageSettings.sectionBackgroundColor}
                          onChange={(e) =>
                            onUpdatePageSettings({ ...pageSettings, sectionBackgroundColor: e.target.value })
                          }
                          className="w-20 h-12 cursor-pointer"
                        />
                        <Input
                          value={pageSettings.sectionBackgroundColor}
                          onChange={(e) =>
                            onUpdatePageSettings({ ...pageSettings, sectionBackgroundColor: e.target.value })
                          }
                          placeholder="#f9fafb"
                          className="text-base"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Settings */}
                <div className="pb-8 border-b-2 border-gray-200">
                  <h3 
                    className="mb-5"
                    style={{
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                      fontSize: '18px',
                      fontWeight: 600,
                      letterSpacing: '-0.01em'
                    }}
                  >
                    Footer Settings
                  </h3>
                  <div>
                    <Label htmlFor="footer-location" className="text-sm font-semibold mb-2 block">Footer Location Text</Label>
                    <Input
                      id="footer-location"
                      value={pageSettings.footerLocation}
                      onChange={(e) =>
                        onUpdatePageSettings({ ...pageSettings, footerLocation: e.target.value })
                      }
                      placeholder="Made in Israel, USA, Italy, Portugal & Germany"
                      className="text-base"
                      required
                    />
                  </div>
                </div>

                {/* CV Upload Section */}
                <div className="pb-8">
                  <h3 
                    className="mb-5"
                    style={{
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                      fontSize: '18px',
                      fontWeight: 600,
                      letterSpacing: '-0.01em'
                    }}
                  >
                    CV Upload
                  </h3>
                  <CVUploader
                    currentCvUrl={pageSettings.cvUrl}
                    onUpload={(url) => onUpdatePageSettings({ ...pageSettings, cvUrl: url })}
                  />
                </div>

                <div className="pt-6 border-t-2 border-gray-200">
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
                    <p 
                      style={{
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
                        fontSize: '14px',
                        color: '#1e40af',
                        fontWeight: 500
                      }}
                    >
                      💡 <strong>Auto-save enabled:</strong> All changes are saved automatically as you type!
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;
