"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  CheckCircle2, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Search,
  Loader2,
  FileText
} from "lucide-react";
import api from "@/lib/axios";

interface StudentPermit {
  id: number;
  status: string;
  reason: string;
  hours_start: number;
  hours_end: number | null;
  created_at: string;
  mapel: {
    fullname: string;
  };
  students: {
    nis: string;
    name: string;
    class: string;
  }[];
}

export default function ApprovedPermitsPage() {
  const [data, setData] = useState<StudentPermit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const fetchData = async () => {
    try {
      setLoading(true);
      // Menggunakan endpoint baru sesuai koreksi Anda
      const res = await api.get("/student-permits/new-approved");
      setData(res.data.data);
    } catch (error) {
      console.error("Error fetching approved permits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter pencarian berdasarkan nama siswa dari data yang sudah APPROVED dari server
  const searchedData = useMemo(() => {
    return data.filter((item) =>
      item.students.some((s) => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const totalPages = Math.ceil(searchedData.length / itemsPerPage);
  const currentData = searchedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#007D72]" />
        <p className="mt-2 text-slate-500 text-sm">Mengambil data izin terbaru...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Cari nama siswa..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#007D72]/20 focus:border-[#007D72] transition-all"
          />
        </div>
      </div>

      {searchedData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
          <FileText className="w-12 h-12 text-slate-200 mb-3" />
          <p className="text-slate-400 text-sm">Tidak ada data izin yang ditemukan.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentData.map((item) => (
              <div key={item.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <CheckCircle2 size={12} />
                    Approved
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                    <Calendar size={12} />
                    {formatDate(item.created_at)}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-2">Siswa Terdaftar</span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.students.map((std, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg text-[11px]">
                          <span className="font-bold text-slate-700">{std.name}</span>
                          <span className="text-slate-400 ml-1">({std.class})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Waktu</span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                        <Clock size={14} className="text-[#007D72]" />
                        Jam {item.hours_start} - {item.hours_end || 'Selesai'}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Guru Mapel</span>
                      <p className="text-xs text-slate-700 font-medium truncate">{item.mapel?.fullname || "-"}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Alasan Izin</span>
                    <p className="text-xs text-slate-600 leading-relaxed italic">`&quot;`{item.reason}`&quot;`</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-400">
              Total <b>{searchedData.length}</b> izin disetujui
            </span>
            
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 text-slate-400 hover:text-[#007D72] disabled:opacity-30"
              >
                <ChevronLeft size={18} />
              </button>
              
              <span className="text-xs font-bold text-slate-700 px-3">
                {currentPage} / {totalPages || 1}
              </span>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 text-slate-400 hover:text-[#007D72] disabled:opacity-30"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}