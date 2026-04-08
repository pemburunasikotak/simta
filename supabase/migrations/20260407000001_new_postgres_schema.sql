-- ==========================================================
-- SKEMA DATABASE SIM TA (VERSI POSTGRESQL)
-- ==========================================================

-- 1. Tabel Master Dosen
CREATE TABLE IF NOT EXISTS public.dosen (
    id_dosen SERIAL PRIMARY KEY,
    nidn VARCHAR(20) UNIQUE NOT NULL,
    nama_dosen VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    kuota_bimbingan INT DEFAULT 10
);

-- 2. Tabel Master Mahasiswa
CREATE TABLE IF NOT EXISTS public.mahasiswa (
    id_mhs SERIAL PRIMARY KEY,
    nim VARCHAR(20) UNIQUE NOT NULL,
    nama_mhs VARCHAR(100) NOT NULL,
    angkatan CHAR(4),
    prodi VARCHAR(50),
    id_pembimbing_utama INT,
    CONSTRAINT fk_pembimbing FOREIGN KEY (id_pembimbing_utama) REFERENCES public.dosen(id_dosen) ON DELETE SET NULL
);

-- 3. Tabel Master Administrasi (Admisi)
CREATE TABLE IF NOT EXISTS public.administrasi (
    id_admin SERIAL PRIMARY KEY,
    nip VARCHAR(20) UNIQUE NOT NULL,
    nama_admin VARCHAR(100) NOT NULL,
    bagian VARCHAR(50)
);

-- 4. Tabel User (Kredensial Login)
CREATE TABLE IF NOT EXISTS public.users (
    id_user SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('Administrasi', 'Dosen', 'Mahasiswa')),
    id_referensi INT NOT NULL,
    last_login TIMESTAMP
);

-- 5. Tabel Tugas Akhir
CREATE TABLE IF NOT EXISTS public.tugas_akhir (
    id_ta SERIAL PRIMARY KEY,
    id_mhs INT UNIQUE,
    judul_ta TEXT NOT NULL,
    abstrak TEXT,
    status_ta VARCHAR(30) DEFAULT 'Proposal',
    tgl_pengajuan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mhs_ta FOREIGN KEY (id_mhs) REFERENCES public.mahasiswa(id_mhs) ON DELETE CASCADE
);

-- 6. Tabel Dosen Pendamping
CREATE TABLE IF NOT EXISTS public.dosen_pendamping (
    id_ta INT,
    id_dosen INT,
    urutan_pendamping INT,
    PRIMARY KEY (id_ta, id_dosen),
    CONSTRAINT fk_ta_pendamping FOREIGN KEY (id_ta) REFERENCES public.tugas_akhir(id_ta) ON DELETE CASCADE,
    CONSTRAINT fk_dosen_pendamping FOREIGN KEY (id_dosen) REFERENCES public.dosen(id_dosen) ON DELETE CASCADE
);

-- 7. Tabel Dokumen (Upload Revisi/Proposal)
CREATE TABLE IF NOT EXISTS public.dokumen_ta (
    id_dokumen SERIAL PRIMARY KEY,
    id_ta INT,
    nama_file VARCHAR(255),
    tipe_dokumen VARCHAR(30),
    versi INT DEFAULT 1,
    catatan_mahasiswa TEXT,
    tgl_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ta_dokumen FOREIGN KEY (id_ta) REFERENCES public.tugas_akhir(id_ta) ON DELETE CASCADE
);

-- 8. Tabel Jadwal Sidang
CREATE TABLE IF NOT EXISTS public.jadwal_sidang (
    id_jadwal SERIAL PRIMARY KEY,
    id_ta INT,
    tipe_sidang VARCHAR(30),
    tgl_sidang TIMESTAMP,
    ruangan VARCHAR(50),
    status_selesai BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_ta_jadwal FOREIGN KEY (id_ta) REFERENCES public.tugas_akhir(id_ta) ON DELETE CASCADE
);

-- 9. Tabel Dosen Penguji & Nilai
CREATE TABLE IF NOT EXISTS public.detail_penguji (
    id_jadwal INT,
    id_dosen INT,
    nilai FLOAT DEFAULT 0,
    catatan_revisi TEXT,
    tgl_input_nilai TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_jadwal, id_dosen),
    CONSTRAINT fk_jadwal_penguji FOREIGN KEY (id_jadwal) REFERENCES public.jadwal_sidang(id_jadwal) ON DELETE CASCADE,
    CONSTRAINT fk_dosen_penguji FOREIGN KEY (id_dosen) REFERENCES public.dosen(id_dosen) ON DELETE CASCADE
);
