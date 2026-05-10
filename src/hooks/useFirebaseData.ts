import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Project, PageSettings, CVData } from '../app/App';

// Safely write to localStorage; swallow quota/serialization errors so the UI never crashes.
function safeLocalStorageSet(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`⚠️ Could not persist "${key}" to localStorage:`, error);
  }
}

// Safely parse JSON from localStorage; returns null if missing or corrupted.
function safeLocalStorageGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (error) {
    console.warn(`⚠️ Corrupted "${key}" in localStorage — clearing:`, error);
    try { localStorage.removeItem(key); } catch {}
    return null;
  }
}

// Transform Firestore document to Project
function transformProject(docData: any, docId: string): Project {
  return {
    id: docId,
    title: docData.title || '',
    description: docData.description || '',
    images: docData.images || [],
    tags: docData.tags || [],
    link: docData.link,
    gridSize: docData.gridSize || 'medium',
    imageFit: docData.imageFit || 'cover',
    colors: docData.colors || [],
    detailedText: docData.detailedText,
    logos: docData.logos || [],
    typography: docData.typography || [],
    motion: docData.motion || [],
    mockups: docData.mockups || [],
    caseStudy: docData.caseStudy || undefined,
  };
}

// Transform Project to Firestore document. Firestore rejects `undefined`, so we coerce
// optional fields to `null` (or empty arrays / sensible defaults) here.
function transformProjectToDb(project: Omit<Project, 'id'>): any {
  return {
    title: project.title,
    description: project.description,
    detailedText: project.detailedText ?? null,
    tags: project.tags || [],
    link: project.link ?? null,
    gridSize: project.gridSize || 'medium',
    imageFit: project.imageFit || 'cover',
    images: project.images || [],
    colors: project.colors || [],
    logos: project.logos || [],
    typography: project.typography || [],
    motion: project.motion || [],
    // Firestore rejects `undefined` even inside nested objects, so coerce
    // each mockup's optional `title` to null before writing.
    mockups: (project.mockups || []).map((m) => ({
      id: m.id,
      imageUrl: m.imageUrl,
      title: m.title ?? null,
    })),
    caseStudy: project.caseStudy ?? null,
    updatedAt: serverTimestamp(),
  };
}

// Transform Firestore document to PageSettings
function transformPageSettings(docData: any): PageSettings {
  return {
    heroTitle: docData.heroTitle || 'ITALUS',
    heroTitleFontSize: docData.heroTitleFontSize || '204px',
    heroQuote: docData.heroQuote || '',
    heroBackgroundImage: docData.heroBackgroundImage,
    workSectionTitle: docData.workSectionTitle || 'Works',
    customSections: docData.customSections || [],
    footerLocation: docData.footerLocation || '',
    cvUrl: docData.cvUrl,
    backgroundColor: docData.backgroundColor || '#ffffff',
    textColor: docData.textColor || '#000000',
    accentColor: docData.accentColor || '#000000',
    sectionBackgroundColor: docData.sectionBackgroundColor || '#f9fafb',
  };
}

// Transform PageSettings to Firestore document
function transformPageSettingsToDb(settings: PageSettings): any {
  return {
    heroTitle: settings.heroTitle,
    heroTitleFontSize: settings.heroTitleFontSize,
    heroQuote: settings.heroQuote ?? '',
    heroBackgroundImage: settings.heroBackgroundImage ?? null,
    workSectionTitle: settings.workSectionTitle,
    customSections: settings.customSections || [],
    footerLocation: settings.footerLocation ?? '',
    cvUrl: settings.cvUrl ?? null,
    backgroundColor: settings.backgroundColor,
    textColor: settings.textColor,
    accentColor: settings.accentColor,
    sectionBackgroundColor: settings.sectionBackgroundColor,
    updatedAt: serverTimestamp(),
  };
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Load projects from Firestore or localStorage
  useEffect(() => {
    async function loadProjects() {
      try {
        // Try loading from localStorage first
        const localProjects = safeLocalStorageGet<Project[]>('projects');
        if (localProjects) {
          setProjects(localProjects);
          console.log('✅ Loaded projects from localStorage (fallback mode)');
        }

        // Try loading from Firebase
        const projectsRef = collection(db, 'projects');
        const q = query(projectsRef, orderBy('updatedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const loadedProjects: Project[] = [];
        querySnapshot.forEach((doc) => {
          loadedProjects.push(transformProject(doc.data(), doc.id));
        });
        
        setProjects(loadedProjects);
        
        // Save to localStorage as backup
        localStorage.setItem('projects', JSON.stringify(loadedProjects));
        
        console.log('✅ Loaded', loadedProjects.length, 'projects from Firebase');
      } catch (error: any) {
        console.log('ℹ️ Using localStorage (Firebase not configured)');
        
        // Load from localStorage as fallback
        const localProjects = safeLocalStorageGet<Project[]>('projects');
        if (localProjects) {
          setProjects(localProjects);
        }
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const addProject = async (projectData: Omit<Project, 'id'>) => {
    try {
      const dbData = {
        ...transformProjectToDb(projectData),
        createdAt: serverTimestamp(),
      };
      
      const projectsRef = collection(db, 'projects');
      const docRef = await addDoc(projectsRef, dbData);
      
      const newProject = transformProject(projectData, docRef.id);
      const updatedProjects = [newProject, ...projects];
      setProjects(updatedProjects);
      
      // Save to localStorage as backup
      safeLocalStorageSet('projects', updatedProjects);
      
      console.log('✅ Project added to Firebase:', docRef.id);
      return docRef;
    } catch (error: any) {
      console.warn('⚠️ Firebase unavailable - using localStorage only:', error.message);
      console.info('💡 To enable Firebase sync, configure Firestore security rules (see FIREBASE_SECURITY_RULES.md)');
      
      // Fallback to localStorage
      const newProject = transformProject(projectData, Date.now().toString());
      const updatedProjects = [newProject, ...projects];
      setProjects(updatedProjects);
      safeLocalStorageSet('projects', updatedProjects);
      
      return { id: newProject.id };
    }
  };

  const updateProject = async (id: string, projectData: Omit<Project, 'id'>) => {
    try {
      const dbData = transformProjectToDb(projectData);
      const projectRef = doc(db, 'projects', id);

      // setDoc with merge so we "upsert" — editing a demo-seeded project creates it in Firestore
      // on first save instead of failing because the doc doesn't exist yet.
      await setDoc(projectRef, { ...dbData, createdAt: serverTimestamp() }, { merge: true });

      const updatedProject = transformProject(projectData, id);
      const updatedProjects = projects.map(p => p.id === id ? updatedProject : p);
      setProjects(updatedProjects);
      
      // Save to localStorage as backup
      safeLocalStorageSet('projects', updatedProjects);
      
      console.log('✅ Project updated in Firebase:', id);
      return updatedProject;
    } catch (error: any) {
      console.warn('⚠️ Firebase unavailable - using localStorage only:', error.message);
      console.info('💡 To enable Firebase sync, configure Firestore security rules (see FIREBASE_SECURITY_RULES.md)');
      
      // Fallback to localStorage
      const updatedProject = transformProject(projectData, id);
      const updatedProjects = projects.map(p => p.id === id ? updatedProject : p);
      setProjects(updatedProjects);
      safeLocalStorageSet('projects', updatedProjects);
      
      return updatedProject;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const projectRef = doc(db, 'projects', id);
      await deleteDoc(projectRef);
      
      const updatedProjects = projects.filter(p => p.id !== id);
      setProjects(updatedProjects);
      
      // Save to localStorage as backup
      safeLocalStorageSet('projects', updatedProjects);
      
      console.log('✅ Project deleted from Firebase:', id);
    } catch (error: any) {
      console.warn('⚠️ Firebase unavailable - using localStorage only:', error.message);
      console.info('💡 To enable Firebase sync, configure Firestore security rules (see FIREBASE_SECURITY_RULES.md)');
      
      // Fallback to localStorage
      const updatedProjects = projects.filter(p => p.id !== id);
      setProjects(updatedProjects);
      safeLocalStorageSet('projects', updatedProjects);
    }
  };

  return { projects, loading, addProject, updateProject, deleteProject };
}

export function usePageSettings() {
  const [pageSettings, setPageSettings] = useState<PageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [settingsDocId, setSettingsDocId] = useState<string | null>(null);

  useEffect(() => {
    async function loadPageSettings() {
      try {
        // Try loading from localStorage first
        const localSettings = safeLocalStorageGet<PageSettings>('pageSettings');
        if (localSettings) {
          setPageSettings(localSettings);
          console.log('✅ Loaded page settings from localStorage (fallback mode)');
        }

        // Try loading from Firebase
        const settingsRef = collection(db, 'page_settings');
        const querySnapshot = await getDocs(settingsRef);
        
        if (!querySnapshot.empty) {
          const firstDoc = querySnapshot.docs[0];
          const settings = transformPageSettings(firstDoc.data());
          setPageSettings(settings);
          setSettingsDocId(firstDoc.id);
          
          // Save to localStorage as backup
          safeLocalStorageSet('pageSettings', settings);
          
          console.log('✅ Loaded page settings from Firebase');
        } else {
          console.log('ℹ️ No page settings found in Firebase - using defaults');
        }
      } catch (error: any) {
        console.log('ℹ️ Using localStorage (Firebase not configured)');
        
        // Load from localStorage as fallback
        const localSettings = safeLocalStorageGet<PageSettings>('pageSettings');
        if (localSettings) {
          setPageSettings(localSettings);
        }
      } finally {
        setLoading(false);
      }
    }

    loadPageSettings();
  }, []);

  const updatePageSettings = async (settings: PageSettings) => {
    try {
      if (!settingsDocId) {
        // Create new settings document if none exists
        const settingsRef = collection(db, 'page_settings');
        const dbData = {
          ...transformPageSettingsToDb(settings),
          createdAt: serverTimestamp(),
        };
        const docRef = await addDoc(settingsRef, dbData);
        setSettingsDocId(docRef.id);
        setPageSettings(settings);
        
        // Save to localStorage as backup
        safeLocalStorageSet('pageSettings', settings);
        
        console.log('✅ Created page settings in Firebase:', docRef.id);
      } else {
        // Update existing settings
        const dbData = transformPageSettingsToDb(settings);
        const settingsRef = doc(db, 'page_settings', settingsDocId);
        await updateDoc(settingsRef, dbData);
        setPageSettings(settings);
        
        // Save to localStorage as backup
        safeLocalStorageSet('pageSettings', settings);
        
        console.log('✅ Updated page settings in Firebase');
      }
    } catch (error: any) {
      console.warn('⚠️ Firebase unavailable - using localStorage only:', error.message);
      console.info('💡 To enable Firebase sync, configure Firestore security rules (see FIREBASE_SECURITY_RULES.md)');
      
      // Fallback to localStorage
      setPageSettings(settings);
      safeLocalStorageSet('pageSettings', settings);
    }
  };

  return { pageSettings, loading, updatePageSettings };
}

// CV Data Hook - using localStorage since CV is not in Firebase
export function useCVData(defaultData: CVData) {
  const [cvData, setCVData] = useState<CVData>(defaultData);
  const [loading, setLoading] = useState(true);

  // Load CV data from localStorage on mount
  useEffect(() => {
    const stored = safeLocalStorageGet<CVData>('cvData');
    if (stored) {
      setCVData(stored);
    }
    setLoading(false);
  }, []);

  // Save CV data to localStorage
  const updateCVData = (newData: CVData) => {
    setCVData(newData);
    safeLocalStorageSet('cvData', newData);
  };

  return { cvData, loading, updateCVData };
}