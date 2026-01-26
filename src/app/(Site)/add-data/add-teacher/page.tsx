"use client";

import { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  MapPin, 
  Save, 
  ArrowLeft,
  School,
  Badge
} from "lucide-react";
import Link from "next/link";

export default function AddTeacherPage() {
  const [loading, setLoading] = useState(false);
//   const []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="w-full h-full space-y-6 flex flex-col">
      
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-700 flex items-center gap-3">
             <div className="p-2 bg-[#007D72]/10 rounded-lg">
                <School className="text-[#007D72]" size={32}/>
             </div>
             Tambah Data Guru
          </h1>
          <p className="text-slate-500 text-sm mt-1 ml-14">
            Isi formulir di bawah untuk mendaftarkan guru baru ke dalam sistem.
          </p>
        </div>

        <Link
            href="/view-data/teacher-data"
            className="flex items-center gap-2 text-slate-500 hover:text-[#007D72] transition-colors text-sm font-medium bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200"
        >
            <ArrowLeft size={16} /> Kembali
        </Link>
      </div>

      
      <div className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg rounded-2xl overflow-hidden flex-1">
        <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
                
                <div>
                    <h3 className="text-[#007D72] font-bold text-lg border-b border-[#007D72]/20 pb-2 mb-4 flex items-center gap-2">
                        <User size={18}/> Informasi Pribadi
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">NIP / NUPTK</label>
                            <div className="relative">
                                <Badge className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="number"
                                    placeholder="Contoh: 19800101..." 
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007D72]/50 focus:border-[#007D72] transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Nama Lengkap */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">Nama Lengkap</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Nama lengkap beserta gelar" 
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007D72]/50 focus:border-[#007D72] transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Jenis Kelamin */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">Jenis Kelamin</label>
                            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007D72]/50 focus:border-[#007D72] transition-all appearance-none text-gray-600">
                                <option value="" disabled selected>Pilih Jenis Kelamin</option>
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </select>
                        </div>

                        {/* Mata Pelajaran */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">Mata Pelajaran Utama</label>
                            <div className="relative">
                                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Contoh: Matematika, Bahasa Inggris" 
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007D72]/50 focus:border-[#007D72] transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bagian 2: Kontak & Alamat */}
                <div>
                    <h3 className="text-[#007D72] font-bold text-lg border-b border-[#007D72]/20 pb-2 mb-4 flex items-center gap-2">
                        <Phone size={18}/> Kontak & Alamat
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="email" 
                                    placeholder="guru@sekolah.sch.id" 
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007D72]/50 focus:border-[#007D72] transition-all"
                                />
                            </div>
                        </div>

                        {/* No Telepon */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">No. WhatsApp / Telepon</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="tel" 
                                    placeholder="0812xxxxxxx" 
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007D72]/50 focus:border-[#007D72] transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Alamat (Full Width) */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-600">Alamat Lengkap</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                                <textarea 
                                    rows={3}
                                    placeholder="Jalan, RT/RW, Kelurahan, Kecamatan..." 
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007D72]/50 focus:border-[#007D72] transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="flex items-center gap-2 bg-[#007D72] text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-[#007D72]/30 hover:bg-[#006058] hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            "Menyimpan..."
                        ) : (
                            <>
                                <Save size={20} /> Simpan Data Guru
                            </>
                        )}
                    </button>
                </div>

            </form>
        </div>
      </div>
    </div>
  );
}