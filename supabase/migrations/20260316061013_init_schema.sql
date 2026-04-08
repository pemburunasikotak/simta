-- SIMTA Database Schema Migration (Prototype - Direct Login)
-- -----------------------------------------------------------------------------

-- 1. Profiles Table (Base table for all users)
-- In prototype mode, we store password directly here and don't depend on auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL, -- Prototype mode: Plain text password
  role TEXT NOT NULL DEFAULT 'mahasiswa' CHECK (role IN ('mahasiswa', 'dosen', 'akademik')),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Specialized Table: Mahasiswa
CREATE TABLE IF NOT EXISTS public.mahasiswa (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  nim TEXT UNIQUE NOT NULL,
  prodi TEXT,
  angkatan INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Specialized Table: Dosen
CREATE TABLE IF NOT EXISTS public.dosen (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  nip TEXT UNIQUE NOT NULL,
  spesialisasi TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Specialized Table: Akademik
CREATE TABLE IF NOT EXISTS public.akademik (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  nip TEXT UNIQUE NOT NULL,
  jabatan TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TA Submissions Table
CREATE TABLE IF NOT EXISTS public.ta_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  file_path TEXT, 
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved', 'rejected')),
  feedback TEXT,
  assessment INTEGER CHECK (assessment >= 0 AND assessment <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Schedules Table
CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  examiner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('seminar', 'ujian_akhir')),
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_mahasiswa_nim ON mahasiswa(nim);
CREATE INDEX IF NOT EXISTS idx_dosen_nip ON dosen(nip);
CREATE INDEX IF NOT EXISTS idx_submissions_student_id ON ta_submissions(student_id);

-- Enable RLS (Simplified for prototype)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mahasiswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE dosen ENABLE ROW LEVEL SECURITY;
ALTER TABLE akademik ENABLE ROW LEVEL SECURITY;
ALTER TABLE ta_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Permissive Policies for Prototype
CREATE POLICY "Enable all for everyone" ON profiles FOR ALL USING (true);
CREATE POLICY "Enable all for everyone" ON mahasiswa FOR ALL USING (true);
CREATE POLICY "Enable all for everyone" ON dosen FOR ALL USING (true);
CREATE POLICY "Enable all for everyone" ON akademik FOR ALL USING (true);
CREATE POLICY "Enable all for everyone" ON ta_submissions FOR ALL USING (true);
CREATE POLICY "Enable all for everyone" ON schedules FOR ALL USING (true);

-- -----------------------------------------------------------------------------
-- Seed Data
-- -----------------------------------------------------------------------------

-- Mahasiswa
INSERT INTO profiles (id, full_name, email, password, role)
VALUES ('74b2e36e-dd70-4691-8922-80f216377c11', 'Mahasiswa 1', 'mhs1@ppns.ac.id', '123456', 'mahasiswa')
ON CONFLICT (email) DO NOTHING;
INSERT INTO mahasiswa (id, nim, prodi, angkatan)
VALUES ('74b2e36e-dd70-4691-8922-80f216377c11', '2103181041', 'Teknik Informatika', 2021)
ON CONFLICT (id) DO NOTHING;

-- Dosen
INSERT INTO profiles (id, full_name, email, password, role)
VALUES ('74b2e36e-dd70-4691-8922-80f216377c12', 'Dosen 1', 'dsn1@ppns.ac.id', '123456', 'dosen')
ON CONFLICT (email) DO NOTHING;
INSERT INTO dosen (id, nip, spesialisasi)
VALUES ('74b2e36e-dd70-4691-8922-80f216377c12', '198001012005011001', 'Cloud Computing')
ON CONFLICT (id) DO NOTHING;

-- Akademik
INSERT INTO profiles (id, full_name, email, password, role)
VALUES ('74b2e36e-dd70-4691-8922-80f216377c13', 'Akademik 1', 'aka1@ppns.ac.id', '123456', 'akademik')
ON CONFLICT (email) DO NOTHING;
INSERT INTO akademik (id, nip, jabatan)
VALUES ('74b2e36e-dd70-4691-8922-80f216377c13', 'AKA-001', 'Kepala Tata Usaha')
ON CONFLICT (id) DO NOTHING;
