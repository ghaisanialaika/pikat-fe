"use client";

import { useState } from "react";
import { 
  User, 
  Save, 
  ArrowLeft,
  School,
  Badge,
  Lock,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios"; // Pastikan path axios anda benar
import { toast } from "sonner"; // Opsional: untuk notifikasi
import { AxiosError } from "axios";

export default function AddTeacherPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // 1. Inisialisasi State sesuai kebutuhan API
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    nip: "",
    fullname: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 2. Mengirim data ke API /users
      await api.post("/users", formData);
      
      toast.success("Guru berhasil didaftarkan!");
      router.push("/view-data/teacher-data"); // Redirect setelah sukses
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data?.message || "Gagal menyimpan data");
            console.error("Error posting user:", error);
        }
    } finally {
      setLoading(false);
    }
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
            Isi kredensial login dan identitas guru untuk akses sistem.
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
                        <User size={18}/> Akun & Identitas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Fullname */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">Nama Lengkap</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    name="fullname"
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    type="text" 
                                    placeholder="Nama Lengkap & Gelar" 
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007D72]/50 focus:border-[#007D72] transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* NIP */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">NIP</label>
                            <div className="relative">
                                <Badge className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    name="nip"
                                    value={formData.nip}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Nomor Induk Pegawai" 
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007D72]/50 focus:border-[#007D72] transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Username */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    type="text" 
                                    placeholder="Username untuk login" 
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007D72]/50 focus:border-[#007D72] transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    type="password" 
                                    placeholder="Minimal 6 karakter" 
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007D72]/50 focus:border-[#007D72] transition-all"
                                    required
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
                            <>
                                <Loader2 className="animate-spin" size={20} /> Menyimpan...
                            </>
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