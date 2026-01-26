"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  User as UserIcon,
  Loader2,
  ChevronLeft,
  ChevronRight,
  School,
} from "lucide-react";
import api from "@/lib/axios";

interface Users {
  id: number;
  username: string;
  fullname: string;
  nip: string | null;
  roles: string[];
  phone?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export default function TeacherPage() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const limit = 8;
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const currentPage = isNaN(Number(page)) ? 1 : Number(page);
      const currentLimit = isNaN(Number(limit)) ? 8 : Number(limit);

      const response = await api.get("/users", {
        params: {
          limit: currentLimit,
          page: currentPage,
          search: searchTerm || undefined,
        },
      });

      setUsers(response.data.data || []);
      if (response.data.meta) {
        setTotalPages(response.data.meta.last_page || 1);
        setTotalData(response.data.meta.totalItems || 0);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, page]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [page, searchTerm]);

  return (
    <>
      <div className="-mb-5 ml-3 flex justify-between">
        <h1 className="text-2xl font-bold text-gray-700 flex items-center gap-3">
          <div className="p-2 bg-[#007D72]/10 rounded-lg">
            <School className="text-[#007D72]" size={32} />
          </div>
          Data Guru
        </h1>
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
          <Link
            href="/add-data/add-teacher"
            className="flex items-center gap-2 bg-[#007D72] text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-[#006058] transition-all font-medium text-sm"
          >
            <Plus size={18} /> Tambah Guru Baru
          </Link>
        </div>
      </div>
      <div className="bg-white/60 w-full h-full rounded-lg shadow-md p-5 space-y-2 overflow-hidden flex flex-col">

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between gap-4 items-center">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 "
              size={18}
            />
            <input
              type="text"
              placeholder="Cari nama atau NIP..."
              className="w-full py-2 pl-10 pr-4 rounded-lg border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:border-slate-300"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="text-sm text-slate-500">
            Total Guru:{" "}
            <span className="font-bold text-slate-700">{totalData}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden flex-1 flex flex-col">
          <div className="overflow-auto custom-scrollbar flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="p-4 text-sm font-bold text-slate-600">Guru</th>
                  <th className="p-4 text-sm font-bold text-slate-600">
                    NIP / ID
                  </th>
                  <th className="p-4 text-sm font-bold text-slate-600 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="p-10 text-center">
                      <Loader2
                        className="animate-spin mx-auto text-[#007D72]"
                        size={32}
                      />
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((teacher) => (
                    <tr
                      key={teacher.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#007D72]/10 text-[#007D72] flex items-center justify-center text-xs font-bold border border-[#007D72]/20">
                            {teacher.fullname.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-700 text-sm">
                              {teacher.fullname}
                            </p>
                            <p className="text-xs text-slate-400">
                              @{teacher.username}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-600 font-mono">
                        {teacher.nip || "-"}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                            <Edit size={16} />
                          </button>
                          <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-12 text-center text-slate-400">
                      <UserIcon
                        size={40}
                        className="mx-auto text-slate-200 mb-2"
                      />
                      <p>Data tidak ditemukan.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center p-4 bg-slate-50 border-t border-slate-200">
            <div className="text-xs md:text-sm text-slate-500 font-medium">
              Halaman <span className="text-slate-800">{page}</span> dari{" "}
              <span className="text-slate-800">{totalPages}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1 || loading}
                className="p-2 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages || loading}
                className="p-2 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
