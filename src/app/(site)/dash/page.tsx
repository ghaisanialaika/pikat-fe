'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './Dash.css';

const Dash = () => {
  const router = useRouter(); // ✅ ubah dari "navigate" jadi "router"
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ✅ fungsi navigasi harus pakai router.push(), bukan navigate()
  const handleAddGuru = () => {
    router.push('/addguru');
  };

  const handleEditProfile = () => {
    router.push('/edit');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="dash-page-wrapper">
      {/* ✅ gunakan path publik untuk gambar */}
      <img src="/logo pikatt.png" alt="Logo Piket Nekat" className="logo-pojok" />

      {/* Dropdown profile */}
      <div className="profile-container">
        <div className="profile-trigger" onClick={toggleDropdown}>
          <div className="dash-profile-logo">
            <img src="/profile.png" alt="Foto Profil" />
          </div>
          <span className="profile-arrow">&#9662;</span>
        </div>

        {isDropdownOpen && (
          <div className="profile-dropdown">
            <button onClick={handleEditProfile} className="dropdown-item">Edit Profile</button>
            {/* ✅ hindari PHP link (karena Next.js bukan PHP app) */}
            <button
              onClick={() => router.push('/logout')}
              className="dropdown-item"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Card utama */}
      <div className="form-dash-card">
        <h2>
          Selamat Datang Kembali, <strong>Admin</strong>
        </h2>
        <p>Apa yang akan kita lakukan hari ini?</p>

        <div className="form-group">
          <button onClick={handleAddGuru} className="tombol dash-add-teacher">
            <span>&#10133;</span> Tambah Data Guru
          </button>
          <button className="tombol dash-add-siswa">
            <span>&#10133;</span> Tambah Data Siswa
          </button>
          <button className="tombol dash-form-izin">
            <span>&#10133;</span> Buat Surat Izin
          </button>
          <button className="tombol dash-recent-form">
            <span>&#128220;</span> Lihat Riwayat Surat Izin
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dash;
