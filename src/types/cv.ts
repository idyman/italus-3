// CV Data Types
export interface CVProfile {
  id?: string;
  full_name: string;
  tagline?: string;
  bio?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface CVWorkExperience {
  id?: string;
  company: string;
  role: string;
  start_date: string;
  end_date?: string;
  description?: string;
  sort_order?: number;
  is_current?: boolean;
}

export interface CVEducation {
  id?: string;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date: string;
  end_date?: string;
  description?: string;
  sort_order?: number;
}

export interface CVLanguage {
  id?: string;
  language: string;
  proficiency: string;
  sort_order?: number;
}

export interface CVSkill {
  id?: string;
  skill_name: string;
  category?: string;
  proficiency_level?: number;
  sort_order?: number;
}

export interface CVCustomSection {
  id?: string;
  section_title: string;
  content: string;
  sort_order?: number;
}

export interface CVSection {
  id?: string;
  section_type: string;
  title: string;
  is_visible: boolean;
  sort_order: number;
}
