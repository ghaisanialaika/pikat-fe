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
  FileText,
  School,
  XCircle,
  AlertCircle,
  User,
  ShieldCheck,
  Download,
} from "lucide-react";
import api from "@/lib/axios";
import { AxiosError } from "axios";

// Interface untuk User (Guru Mapel & Petugas Piket)
interface ApiUser {
  fullname: string;
  username: string;
}

// Interface untuk Detail Siswa di dalam Izin
interface StudentPermitDetail {
  id: number;
  student_permit_id: number;
  student_nis: string;
  // Jika ada objek student di dalamnya berdasarkan data asli:
  student?: {
    name: string;
    nis: string;
    class: string;
  };
}

// Interface Utama StudentPermit
interface StudentPermit {
  id: number;
  reason: string;
  hours_start: number;
  hours_end: number | null;
  status: "PENDING_MAPEL" | "PENDING_PIKET" | "APPROVED" | "REJECTED" | "CANCELED";
  created_at: string;
  updated_at: string;
  
  // Relasi User
  mapel_user_id: number;
  mapel_user: ApiUser | null;
  piket_user_id: number;
  piket_user: ApiUser | null;
  
  // Data Siswa (Berdasarkan JSON Anda, ini adalah array detail)
  student_permit_details: StudentPermitDetail[];
  
  // Property tambahan jika ada
  studentsNis: string | null;
}

// Interface untuk Wrapper Response API
interface ApiResponse {
  success: boolean;
  message: string;
  data: StudentPermit[];
}

export default function ReportData() {
  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const [data, setData] = useState<StudentPermit[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Set default: Tanggal Hari Ini dan Status APPROVED
  const [startDate, setStartDate] = useState(getTodayDate());
  const [endDate, setEndDate] = useState(getTodayDate());
  const [status, setStatus] = useState("APPROVED");

  const itemsPerPage = 4;

  const fetchData = async () => {
    if (!startDate || !endDate) return;
    try {
      setLoading(true);
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      });
      if (status) params.append("status", status);

      const res = await api.get(
        `/reports/student-permits?${params.toString()}`,
      );
      setData(res.data?.data || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi Export ke Excel/PDF
  const handleExport = async () => {
    try {
      setExporting(true);

      // Siapkan query params agar sama dengan saat kita fetch data
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      });
      if (status) params.append("status", status);

      // Menggunakan GET dengan query params
      const response = await api.get(
        `/reports/student-permits/export?${params.toString()}`,
        {
          responseType: "blob", // Penting agar file tidak rusak
        },
      );

      // Proses pengunduhan file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Sesuaikan ekstensi file (xlsx/pdf) sesuai instruksi backend Anda
      link.setAttribute("download", `Laporan-Izin-${startDate}.xlsx`);

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Bersihkan memori
    } catch (error) {

      if (error instanceof AxiosError) {
        
        if (error?.response?.status === 404) {
          alert("Error: Endpoint export belum tersedia di server (404).");
        } else {
          alert("Gagal mengunduh laporan. Pastikan tanggal sudah dipilih.");
        }
      }
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, status]);

  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter((item) => {
      const students = item?.student_permit_details || [];
      return students.some((s) =>
        (s?.student?.name || "Siswa")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      );
    });
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <>
      <div className="-mb-8 ml-3 flex justify-between items-end pr-4">
        <h1 className="font-bold text-gray-700 flex items-center gap-3">
          <div className="p-2 bg-[#007D72]/10 rounded-lg">
            <School className="text-[#007D72]" size={32} />
          </div>
          <span className="text-2xl font-bold text-slate-800">
            Laporan Izin Siswa
          </span>
        </h1>

        {/* Tombol Export */}
        <button
          onClick={handleExport}
          disabled={exporting || data.length === 0}
          className="flex items-center gap-2 bg-[#007D72] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#00665C] transition-all disabled:opacity-50"
        >
          {exporting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          Export Laporan
        </button>
      </div>

      <div className="bg-white/60 w-full h-full rounded-xl shadow-md p-9 space-y-6 flex flex-col mt-12 backdrop-blur-sm border border-white">
        <div className="flex flex-col xl:flex-row gap-4 justify-between">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-2 border rounded-xl shadow-sm">
              <Calendar size={16} className="text-[#007D72]" />
              <input
                type="date"
                value={startDate}
                className="text-sm outline-none bg-transparent font-medium"
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="text-slate-300">-</span>
              <input
                type="date"
                value={endDate}
                className="text-sm outline-none bg-transparent font-medium"
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 bg-white border rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#007D72]/20"
              onChange={(e) => setStatus(e.target.value)}
              value={status}
            >
              <option value="">Semua Status</option>
              <option value="PENDING_MAPEL">PENDING MAPEL</option>
              <option value="PENDING_PIKET">PENDING PIKET</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari nama siswa..."
              className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm w-full md:w-72 bg-white outline-none focus:border-[#007D72]"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content List Card */}
        {loading ? (
          <div className="flex-1 flex flex-col justify-center items-center py-20">
            <Loader2 className="animate-spin text-[#007D72] mb-2" size={40} />
            <p className="text-sm text-slate-500 font-medium">
              Memuat laporan...
            </p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-2xl">
            <FileText size={48} className="text-slate-200 mb-2" />
            <p className="text-slate-400 text-sm font-medium">
              Tidak ada data untuk filter ini
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {currentData.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                {/* Header Card */}
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${
                      item.status === "APPROVED"
                        ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                        : "text-amber-600 bg-amber-50 border-amber-100"
                    }`}
                  >
                    {item.status.replace("_", " ")}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold bg-slate-50 px-2 py-1 rounded">
                    ID: #{item.id}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Siswa */}
                  <div className="flex flex-wrap gap-1.5">
                    {item.student_permit_details?.map((s, idx: number) => (
                      <span
                        key={idx}
                        className="bg-[#007D72]/5 text-[#007D72] px-2.5 py-1 rounded-md text-[11px] font-bold border border-[#007D72]/10"
                      >
                        {s?.student?.name || "Siswa"}
                      </span>
                    ))}
                  </div>

                  {/* Info Waktu */}
                  <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        Waktu Keluar
                      </p>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <Clock size={14} className="text-[#007D72]" /> Jam{" "}
                        {item.hours_start} - {item.hours_end || "Selesai"}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        Tanggal
                      </p>
                      <div className="text-xs font-bold text-slate-700">
                        {new Date(item.created_at).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Penanggung Jawab */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[11px]">
                      <User size={14} className="text-slate-400" />
                      <span className="font-medium text-slate-500">
                        Guru Mapel:
                      </span>
                      <span className="font-bold text-slate-700 truncate">
                        {item.mapel_user?.fullname || "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <ShieldCheck size={14} className="text-slate-400" />
                      <span className="font-medium text-slate-500">
                        Petugas Piket:
                      </span>
                      <span className="font-bold text-slate-700">
                        {item.piket_user?.fullname || "-"}
                      </span>
                    </div>
                  </div>

                  {/* Alasan */}
                  <div className="bg-slate-50 p-3 rounded-xl border-l-4 border-slate-200">
                    <p className="text-xs text-slate-600 italic">
                      {item.reason}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center pt-6 border-t mt-auto">
            <span className="text-xs text-slate-400 font-bold italic">
              Total {filteredData.length} Laporan
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2 border rounded-xl hover:bg-[#007D72] hover:text-white transition-all disabled:opacity-30"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="text-xs font-bold px-4 text-slate-700">
                {currentPage} / {totalPages}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2 border rounded-xl hover:bg-[#007D72] hover:text-white transition-all disabled:opacity-30"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
