-- CV Profile Table
CREATE TABLE IF NOT EXISTS cv_profile (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  phone TEXT,
  email TEXT,
  nationality TEXT,
  date_of_birth TEXT,
  positioning_summary TEXT,
  core_strengths TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CV Work Experience Table
CREATE TABLE IF NOT EXISTS cv_work_experience (
  id SERIAL PRIMARY KEY,
  company TEXT NOT NULL,
  location TEXT,
  title TEXT NOT NULL,
  description TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  responsibilities TEXT[],
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CV Education Table
CREATE TABLE IF NOT EXISTS cv_education (
  id SERIAL PRIMARY KEY,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT NOT NULL,
  start_year INTEGER NOT NULL,
  end_year INTEGER NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CV Languages Table
CREATE TABLE IF NOT EXISTS cv_languages (
  id SERIAL PRIMARY KEY,
  language TEXT NOT NULL,
  proficiency TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CV Skills Table
CREATE TABLE IF NOT EXISTS cv_skills (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  skills TEXT[],
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE cv_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_skills ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY "Allow public read access on cv_profile" ON cv_profile FOR SELECT USING (true);
CREATE POLICY "Allow public read access on cv_work_experience" ON cv_work_experience FOR SELECT USING (true);
CREATE POLICY "Allow public read access on cv_education" ON cv_education FOR SELECT USING (true);
CREATE POLICY "Allow public read access on cv_languages" ON cv_languages FOR SELECT USING (true);
CREATE POLICY "Allow public read access on cv_skills" ON cv_skills FOR SELECT USING (true);

-- Create policies to allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated insert on cv_profile" ON cv_profile FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on cv_profile" ON cv_profile FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on cv_profile" ON cv_profile FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on cv_work_experience" ON cv_work_experience FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on cv_work_experience" ON cv_work_experience FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on cv_work_experience" ON cv_work_experience FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on cv_education" ON cv_education FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on cv_education" ON cv_education FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on cv_education" ON cv_education FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on cv_languages" ON cv_languages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on cv_languages" ON cv_languages FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on cv_languages" ON cv_languages FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on cv_skills" ON cv_skills FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on cv_skills" ON cv_skills FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on cv_skills" ON cv_skills FOR DELETE USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_cv_profile_updated_at BEFORE UPDATE ON cv_profile FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cv_work_experience_updated_at BEFORE UPDATE ON cv_work_experience FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cv_education_updated_at BEFORE UPDATE ON cv_education FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cv_languages_updated_at BEFORE UPDATE ON cv_languages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cv_skills_updated_at BEFORE UPDATE ON cv_skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
