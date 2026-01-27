"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  School,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Save,
  BookOpen,
} from "lucide-react";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Subject {
  id: number;
  name: string;
}

export default function SubjectsPage() {
  // State Data
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [totalData, setTotalData] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const limit = 8;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "" });

  // --- API CALLS ---

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/subjects`, {
        params: {
          limit,
          page,
          search: searchTerm, // Perbaikan typo 'seach'
        },
      });
      setSubjects(res.data.data || []);
      const meta = res.data.meta;
      if (meta) {
        setTotalPages(meta.totalPages || 1);
        setTotalData(meta.totalItems || 0);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Gagal mengambil data");
      }
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSubjects();
    }, 500); // Debounce 500ms
    return () => clearTimeout(delayDebounceFn);
  }, [fetchSubjects]);

  // --- HANDLERS ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editId) {
        await api.put(`/subjects/${editId}`, formData);
        toast.success("Mata pelajaran berhasil diperbarui");
      } else {
        await api.post("/subjects", formData);
        toast.success("Mata pelajaran baru ditambahkan");
      }
      closeModal();
      fetchSubjects();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Terjadi kesalahan");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus mata pelajaran ini?")) return;
    try {
      await api.delete(`/subjects/${id}`);
      toast.success("Mata pelajaran dihapus");
      fetchSubjects();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Terjadi kesalahan");
      }
    }
  };

  const openEditModal = (subject: Subject) => {
    setEditId(subject.id);
    setFormData({ name: subject.name });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setFormData({ name: "" });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-700 flex items-center gap-3">
          <div className="p-2 bg-[#007D72]/10 rounded-lg">
            <BookOpen className="text-[#007D72]" size={32} />
          </div>
          Data Mata Pelajaran
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#007D72] text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-[#006058] transition-all font-medium text-sm"
        >
          <Plus size={18} /> Tambah Mapel
        </button>
      </div>

      {/* Filter & Stats */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between gap-4 items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cari Mata Pelajaran..."
            className="w-full py-2 pl-10 pr-4 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#007D72]/20 outline-none"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="text-sm text-slate-500">
          Total: <span className="font-bold text-slate-700">{totalData}</span> Mapel
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">ID</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Nama Mata Pelajaran</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-10 text-center">
                    <Loader2 className="animate-spin mx-auto text-[#007D72]" size={32} />
                  </td>
                </tr>
              ) : subjects.length > 0 ? (
                subjects.map((subject) => (
                  <tr key={subject.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm font-mono text-slate-500">#{subject.id}</td>
                    <td className="p-4 text-sm font-medium text-slate-700">{subject.name}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(subject)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(subject.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-10 text-center text-slate-400 text-sm">
                    Data mata pelajaran tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4 bg-slate-50 border-t border-slate-200">
          <span className="text-xs text-slate-500 font-medium">
            Halaman {page} dari {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1 || loading}
              className="p-2 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages || loading}
              className="p-2 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal CRUD */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[400px] border-t-8 border-[#007D72]">
          <DialogHeader>
            <DialogTitle>{editId ? "Ubah Mata Pelajaran" : "Tambah Mata Pelajaran"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase">Nama Mapel</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-[#007D72]/20 outline-none text-sm"
                placeholder="Contoh: Matematika"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-sm font-semibold text-slate-500"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#007D72] text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Simpan
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}