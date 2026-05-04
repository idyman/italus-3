import { useState, useEffect, lazy, Suspense, startTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { useProjects, usePageSettings, useCVData } from "../hooks/useFirebaseData";
import { PortfolioPage } from "./components/PortfolioPage";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

// Wraps each view in a motion container so route swaps cross-fade with a subtle slide.
const VIEW_TRANSITION = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.35, ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number] },
};

// Lazy load admin and detail pages only (not the main portfolio page)
const ProjectDetailPage = lazy(() => import("./components/ProjectDetailPage").then(module => ({ default: module.ProjectDetailPage })));
const CVPage = lazy(() => import("./components/CVPage").then(module => ({ default: module.CVPage })));
const LoginPage = lazy(() => import("./components/LoginPage").then(module => ({ default: module.LoginPage })));
const AdminDashboard = lazy(() => import("./components/AdminDashboard").then(module => ({ default: module.AdminDashboard })));

// Fast loading fallback with minimal styles
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-black border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
      </div>
    </div>
  );
}

export interface ProjectImage {
  url: string;
  description: string;
}

export interface TypographyItem {
  fontFamily: string;
  sampleText: string;
  fontUrl?: string; // Optional Google Fonts URL or custom font URL
}

export interface MotionItem {
  url: string; // Video or GIF URL
  description: string;
  type: "video" | "gif";
}

export interface MockupItem {
  id: string;
  imageUrl: string; // The screen image to display on the phone
  title?: string; // Optional title/description
}

export interface CaseStudy {
  oneLineSummary?: string;
  client?: string;
  timeframe?: string;
  context?: string;
  challenge?: string;
  objectives?: string[]; // Numbered list
  strategyTitle?: string;
  strategyDescription?: string;
  whatWeDid?: {
    category: string; // e.g., "Campaign workstreams"
    items: string[]; // Bullet points
  }[];
  deliverables?: string;
  role?: string; // e.g., "Art Director and Brand, UX Lead"
  responsibilities?: string;
  resultsIntro?: string; // Intro paragraph for results
  resultsMetrics?: string[]; // Key metrics as bullet points
  resultsDetails?: {
    category: string; // e.g., "Growth in usage and distribution"
    items: string[]; // Metrics under this category
  }[];
  whatMadeItWork?: string[]; // Numbered list
  learnings?: string[]; // Numbered list
  whatToShow?: string[]; // Numbered list
  source?: string; // Footer citation
}

export interface Project {
  id: string;
  title: string;
  description: string;
  images: ProjectImage[];
  tags: string[];
  link?: string;
  gridSize?: "small" | "medium" | "large";
  imageFit?: "cover" | "contain" | "cover-top" | "cover-center" | "cover-bottom";
  colors?: string[];
  detailedText?: string;
  logos?: ProjectImage[]; // Optional logo section
  typography?: TypographyItem[]; // Optional typography section
  motion?: MotionItem[]; // Optional motion section
  mockups?: MockupItem[]; // Optional mockup section
  caseStudy?: CaseStudy; // Optional case study section
}

export interface CVPersonalInfo {
  email: string;
  mobile: string;
  nationality: string;
  dateOfBirth: string;
}

export interface CVPhilosophy {
  quote: string;
  author: string;
}

export interface CVEducation {
  id: string;
  institution: string;
  location: string;
  dates: string;
  degree: string;
  faculty: string;
}

export interface CVWorkExperience {
  id: string;
  company: string;
  location: string;
  dates: string;
  position: string;
  typeOfBusiness: string;
  responsibilities: string;
}

export interface CVOtherSkill {
  id: string;
  type: "school" | "course" | "organization";
  name: string;
  location: string;
  dates: string;
  title: string;
  description?: string;
}

export interface CVLanguagesAndSoftware {
  languages: string[];
  software: string[];
}

export interface CVAboutMe {
  paragraphs: string[];
}

export interface CVData {
  personalInfo: CVPersonalInfo;
  philosophy: CVPhilosophy;
  education: CVEducation[];
  workExperience: CVWorkExperience[];
  automotiveExperience: CVWorkExperience[];
  otherSkills: CVOtherSkill[];
  languagesAndSoftware: CVLanguagesAndSoftware;
  aboutMe: CVAboutMe;
}

export interface PageSettings {
  // Hero Section
  heroTitle: string;
  heroTitleFontSize: string;
  heroQuote: string;
  heroBackgroundImage?: string; // New: URL for hero background image
  
  // Section Settings
  workSectionTitle: string;
  customSections?: CustomSection[]; // New: Dynamic sections
  
  // Footer
  footerLocation: string;
  
  // CV
  cvUrl?: string;
  
  // Colors
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  sectionBackgroundColor: string;
}

export interface CustomSection {
  id: string;
  title: string;
  description: string;
  order: number;
}

type View = "portfolio" | "login" | "admin" | "project-detail" | "cv";

// Initial demo projects with Unsplash images
const DEMO_PROJECTS: Project[] = [
  {
    id: "1",
    title: "mono characters",
    description: "A collection of hand-crafted 3D characters exploring the intersection of minimalism and personality.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1657757996603-acec063f1d9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwZGVzaWduJTIwd29ya3NwYWNlfGVufDF8fHx8MTc2NzczODIwMXww&ixlib=rb-4.1.0&q=80&w=1080",
        description: "A 3D character with a minimalist design.",
      },
    ],
    tags: ["3D", "Character Design", "Minimalism"],
    gridSize: "large",
  },
  {
    id: "2",
    title: "experiments",
    description: "Visual explorations mixing analog and digital media to develop novel expressions.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0fGVufDF8fHx8MTc2Nzc2NTY2NXww&ixlib=rb-4.1.0&q=80&w=1080",
        description: "A digital art piece.",
      },
    ],
    tags: ["Art", "Digital", "Experimental"],
    link: "#",
    gridSize: "medium",
  },
  {
    id: "3",
    title: "google lens",
    description: "Visual search experiences that connect the physical and digital worlds seamlessly.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1717323454555-f053c31ff4b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBpbnRlcmZhY2UlMjBkZXNpZ258ZW58MXx8fHwxNzY3NjkzNjE1fDA&ixlib=rb-4.1.0&q=80&w=1080",
        description: "A product design for Google Lens.",
      },
    ],
    tags: ["Product Design", "Google", "AI"],
    link: "#",
    gridSize: "large",
  },
  {
    id: "4",
    title: "time experiment",
    description: "Exploring temporal interfaces and how design can manipulate our perception of time.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1644088379091-d574269d422f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY3ODAwNDUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
        description: "An interaction design experiment.",
      },
    ],
    tags: ["Interaction Design", "Experiment"],
    gridSize: "small",
  },
  {
    id: "5",
    title: "mono studio brand design",
    description: "Visual identity system for a modern design studio focusing on simplicity and impact.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1554941829-202a0b2403b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHN0dWRpb3xlbnwxfHx8fDE3Njc3MDc1NjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
        description: "A branding and visual identity project.",
      },
    ],
    tags: ["Branding", "Visual Identity", "Typography"],
    link: "#",
    gridSize: "medium",
  },
  {
    id: "6",
    title: "next generation assistant",
    description: "Reimagining AI assistants with empathy and context awareness at the core.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1602128110234-2d11c0aaadfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2NzcwMjIyNHww&ixlib=rb-4.1.0&q=80&w=1080",
        description: "An AI assistant design.",
      },
    ],
    tags: ["AI", "UX", "Voice Design"],
    gridSize: "large",
  },
];

// Default CV data
const DEFAULT_CV_DATA: CVData = {
  personalInfo: {
    email: "itamardesign@gmail.com",
    mobile: "+ 972 (0)54 6495011",
    nationality: "Portuguese / Israeli",
    dateOfBirth: "25.8.1976",
  },
  philosophy: {
    quote: "A human being should be able to change a diaper, plan an invasion, butcher a hog, conn a ship, design a building, write a sonnet, balance accounts, build a wall, set a bone, comfort the dying, take orders, give orders, cooperate, act alone, solve equations, analyze a new problem, pitch manure, program a computer, cook a tasty meal, fight efficiently, die gallantly.\n\nSpecialization is for insects.",
    author: "Robert A. Heinlein",
  },
  education: [
    {
      id: "1",
      institution: "Scuola Politecnica di Design, Milan, Italy",
      location: "Milan, Italy",
      dates: "2005-2006",
      degree: "M.A. Master of Fine Arts",
      faculty: "Faculty of Transportation Design",
    },
    {
      id: "2",
      institution: "Bezalel Academy of Art and Design, Jerusalem, Israel",
      location: "Jerusalem, Israel",
      dates: "1999 – 2005",
      degree: "B.Des, Bachelor of Design",
      faculty: "Faculty of Industrial Design / Product Design",
    },
  ],
  workExperience: [
    {
      id: "1",
      company: "Camlyo / 12Handz",
      location: "Tel Aviv, Israel",
      dates: "2021 - Present",
      position: "Senior Brand & Marketing Design Lead",
      typeOfBusiness: "Online presence solutions for online service providers",
      responsibilities: "Overseeing the brands planning process inclusive of the definition of target consumers, and the development and the design of the marketing mix and strategies on the consumer brand-interaction in order to encourage increased purchase of the product.",
    },
    {
      id: "2",
      company: "L/H / TBWA",
      location: "Tel Aviv, Israel",
      dates: "2020 - 2021",
      position: "Senior Creative Art Director",
      typeOfBusiness: "Advertising",
      responsibilities: "Leading the concept, UX/UI design and execution of ground-breaking visual solutions for integrated, cross-channel initiatives in the digital and social sphere of top clients.",
    },
    {
      id: "3",
      company: "Ogilvy",
      location: "Tel Aviv, Israel",
      dates: "2019 - 2020",
      position: "Creative / Senior Art Director",
      typeOfBusiness: "Advertising",
      responsibilities: "Position required being responsible for contributing to the development of large-scale digital and OOH campaigns and experiences which focus on customer solutions, while simultaneously meeting advertiser goals.",
    },
    {
      id: "4",
      company: "Hooligans - a part of K Group",
      location: "Tel Aviv, Israel",
      dates: "2017 - 2019",
      position: "Creative / Senior Designer",
      typeOfBusiness: "Data driven creative agency",
      responsibilities: "Creating smart, impactful, and constantly optimizing consumer journeys and brand experiences by incorporating information architecture, web flows, UX/UI, for B2B SaaS brands.",
    },
    {
      id: "5",
      company: "AVRAHAM Adv.",
      location: "Tel Aviv, Israel",
      dates: "2016 - 2017",
      position: "Creative / Senior Art Director",
      typeOfBusiness: "Advertising",
      responsibilities: "Generating ideas and concepts in tandem with creative copywriting. Producing sketches, storyboards, art layouts based on creative visions and ideas. Understanding marketing initiatives, strategic positioning, and target audience.",
    },
    {
      id: "6",
      company: "TBWA / Yehoshua",
      location: "Tel Aviv, Israel",
      dates: "2015 - 2016",
      position: "Senior Art Director",
      typeOfBusiness: "Advertising",
      responsibilities: "The role involved producing creative and innovative ideas for the visual elements of advertising campaigns on various cross-media platforms for some markets' global leading brands.",
    },
    {
      id: "7",
      company: "Tamooz Marketing Communications",
      location: "Tel Aviv, Israel / Geneva, Switzerland",
      dates: "2012 - 2014",
      position: "Creative Director",
      typeOfBusiness: "Creative agency - Advertising / Visual communications",
      responsibilities: "Leading the creative team to create a plan and deliver a strategic vision for the company's clients.",
    },
  ],
  automotiveExperience: [
    {
      id: "1",
      company: "Green Ride",
      location: "Haifa, Israel",
      dates: "2012 - 2014",
      position: "Creative Director / Head Designer",
      typeOfBusiness: "Automotive startup",
      responsibilities: "Design team leader: concept ideation, concept development, Transportation Design, Graphic Design, UX/UI/GUI.",
    },
    {
      id: "2",
      company: "Fiat Chrysler Automobiles",
      location: "Turin, Italy",
      dates: "2007",
      position: "Exterior Designer",
      typeOfBusiness: "Automobile",
      responsibilities: "\"Concept car\" Directed by Roberto Giolito - Head of FIAT centro stile.",
    },
    {
      id: "3",
      company: "Alfa Romeo",
      location: "Arese, Italy",
      dates: "2007",
      position: "Interior Designer",
      typeOfBusiness: "Automotive - Color and trim",
      responsibilities: "Directed by Mr.Favilla / Mr.Maccolini Head designers.",
    },
    {
      id: "4",
      company: "Audi",
      location: "Milan, Italy",
      dates: "2006 - 2007",
      position: "Exterior Designer",
      typeOfBusiness: "Automotive",
      responsibilities: "\"A6 Avant 2015\" design team. Directed by Mr. Walter de Silva. Head designer for Audi group.",
    },
  ],
  otherSkills: [
    {
      id: "1",
      type: "school",
      name: "Le Cordon Bleu / College of Culinary Arts",
      location: "Boston, U.S.A",
      dates: "2005",
      title: "Chef de Cuisine",
      description: "Over 4 years in top restaurants in Israel, U.S.A. and Italy",
    },
    {
      id: "2",
      type: "course",
      name: "Lifeguard",
      location: "Israel",
      dates: "2004",
      title: "Professional lifeguard",
    },
    {
      id: "3",
      type: "organization",
      name: "IDF - Israel Defence Forces",
      location: "Israel",
      dates: "1994 - 1997",
      title: "Combat soldier / Commander",
    },
  ],
  languagesAndSoftware: {
    languages: [
      "Eagerly learning German",
      "English - fluent",
      "Italian - fluent",
      "Hebrew - fluent",
      "Spanish - proficient",
      "French - proficient",
      "Arabic - proficient",
    ],
    software: [
      "Adobe CC",
      "Photoshop, Illustrator, Indesign",
      "Premiere Pro",
      "Figma, XD, Sketch, Invision",
      "Autodesk Alias, Sketchup, Vray",
      "Microsoft 365, Wordpress, Elementor",
    ],
  },
  aboutMe: {
    paragraphs: [
      "Over my years of experience, I have had the opportunity to develop and conceptualize extraordinary, integrated, international B2C and B2B cross-media brand campaigns that have generated attention and engagement. I've managed to create creative and visual communication online and offline concepts.",
      "This required, among other skills, the overseeing and editing of content for screen and web design, as well as planning and supervision of shootings, film recordings, and digital campaigns, along with the creation of meaningful branding and websites as well as for service providers. In order to accomplish these projects successfully, I stay updated with new consumer groups, trends, and latest techniques and tools, as well as close cooperation and coordination with marketing and the various departments within the organization.",
    ],
  },
};

// Default page settings
const DEFAULT_PAGE_SETTINGS: PageSettings = {
  heroTitle: "Italus.",
  heroTitleFontSize: "204px",
  heroQuote: "A human being should be able to change a diaper, plan an invasion, butcher a hog, conn a ship, design a building, write a sonnet, balance accounts, build a wall, set a bone, comfort the dying, take orders, give orders, cooperate, act alone, solve equations, analyze a new problem, pitch manure, program a computer, cook a tasty meal, fight efficiently, die gallantly. Specialization is for insects.",
  heroBackgroundImage: undefined,
  workSectionTitle: "Works",
  customSections: [],
  footerLocation: "Made in Israel, USA, Italy, Portugal & Germany",
  cvUrl: "https://example.com/cv.pdf",
  backgroundColor: "#ffffff",
  textColor: "#000000",
  accentColor: "#000000",
  sectionBackgroundColor: "#f9fafb",
};

export default function App() {
  const [view, setView] = useState<View>("portfolio");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Subscribe to Firebase Auth state. Session persists across reloads automatically.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const signedIn = !!user;
      setIsAuthenticated(signedIn);
      // If the user gets signed out while on the admin view, bounce them to the portfolio.
      if (!signedIn) {
        setView((current) => (current === "admin" ? "portfolio" : current));
      }
    });
    return unsubscribe;
  }, []);
  
  // Use Firebase hooks
  const { projects, loading: projectsLoading, addProject, updateProject, deleteProject } = useProjects();
  const { pageSettings, loading: settingsLoading, updatePageSettings } = usePageSettings();
  const { cvData, loading: cvLoading, updateCVData } = useCVData(DEFAULT_CV_DATA);

  // Use default settings while loading or if not available
  const currentSettings = pageSettings || DEFAULT_PAGE_SETTINGS;
  
  // Use demo projects if no projects loaded from DB
  const currentProjects = projects.length > 0 ? projects : DEMO_PROJECTS;

  const handleLogin = async (email: string, password: string) => {
    setLoggingIn(true);
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      startTransition(() => {
        setView("admin");
      });
      toast.success("Welcome back!");
    } catch (error: any) {
      const code = error?.code || "";
      const message =
        code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found"
          ? "Invalid email or password."
          : code === "auth/too-many-requests"
          ? "Too many attempts. Try again in a few minutes."
          : code === "auth/network-request-failed"
          ? "Network error. Check your connection."
          : "Sign-in failed. Please try again.";
      setLoginError(message);
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.warn("Sign-out failed:", error);
    }
    startTransition(() => {
      setView("portfolio");
    });
    toast.success("Logged out successfully");
  };

  const handleAddProject = (projectData: Omit<Project, "id">) => {
    const newProject = {
      ...projectData,
      id: Date.now().toString(),
    };
    
    addProject(newProject);
    toast.success("Project added successfully!");
  };

  const handleUpdateProject = (id: string, projectData: Omit<Project, "id">) => {
    updateProject(id, projectData);
    toast.success("Project updated successfully!");
  };

  const handleDeleteProject = (id: string) => {
    deleteProject(id);
    toast.success("Project deleted successfully!");
  };

  // Page settings handler
  const handleUpdatePageSettings = async (settings: PageSettings) => {
    try {
      await updatePageSettings(settings);
      toast.success("Page settings updated successfully!");
    } catch (error: any) {
      toast.error(`Failed to update settings: ${error.message}`);
    }
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    startTransition(() => {
      setView("project-detail");
    });
  };

  const handleBackToPortfolio = () => {
    setSelectedProject(null);
    startTransition(() => {
      setView("portfolio");
    });
  };

  const handleNavigateProject = (direction: "prev" | "next") => {
    if (!selectedProject) return;
    
    const currentIndex = currentProjects.findIndex(p => p.id === selectedProject.id);
    let newIndex: number;
    
    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : currentProjects.length - 1;
    } else {
      newIndex = currentIndex < currentProjects.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedProject(currentProjects[newIndex]);
  };

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        {view === "portfolio" && (
          <motion.div key="portfolio" {...VIEW_TRANSITION}>
            <PortfolioPage
              projects={currentProjects}
              pageSettings={currentSettings}
              onAdminClick={() => startTransition(() => setView(isAuthenticated ? "admin" : "login"))}
              onProjectClick={handleProjectClick}
              onCVClick={() => startTransition(() => setView("cv"))}
            />
          </motion.div>
        )}

        {view === "cv" && (
          <motion.div key="cv" {...VIEW_TRANSITION}>
            <Suspense fallback={<LoadingFallback />}>
              <CVPage
                pageSettings={currentSettings}
                onBack={() => startTransition(() => setView("portfolio"))}
              />
            </Suspense>
          </motion.div>
        )}

        {view === "login" && (
          <motion.div key="login" {...VIEW_TRANSITION}>
            <Suspense fallback={<LoadingFallback />}>
              <LoginPage
                onLogin={handleLogin}
                onBack={() => startTransition(() => setView("portfolio"))}
                error={loginError}
                submitting={loggingIn}
              />
            </Suspense>
          </motion.div>
        )}

        {view === "admin" && isAuthenticated && (
          <motion.div key="admin" {...VIEW_TRANSITION}>
            <Suspense fallback={<LoadingFallback />}>
              <AdminDashboard
                projects={currentProjects}
                onLogout={handleLogout}
                onAddProject={handleAddProject}
                onUpdateProject={handleUpdateProject}
                onDeleteProject={handleDeleteProject}
                pageSettings={currentSettings}
                onUpdatePageSettings={handleUpdatePageSettings}
              />
            </Suspense>
          </motion.div>
        )}

        {view === "project-detail" && selectedProject && (
          <motion.div key={`detail-${selectedProject.id}`} {...VIEW_TRANSITION}>
            <Suspense fallback={<LoadingFallback />}>
              <ProjectDetailPage
                project={selectedProject}
                onBack={handleBackToPortfolio}
                onNavigate={handleNavigateProject}
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster position="bottom-right" />
    </>
  );
}