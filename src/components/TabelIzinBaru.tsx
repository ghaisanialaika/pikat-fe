"use client";

import api from "@/lib/axios";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { SkeletonText } from "./sekeleton/SekeletonText";
import { Button } from "./ui/button";

interface Permission {
  id: number;
  students: {
    nis: string;
    name: string;
    class: string;
  }[];
  reason: string;
  created_at: string;
}

export default function TabelIzinBaru() {
  const [permits, setPermits] = useState<Permission[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const fetchPermissions = async () => {
    setLoadingData(true);
    try {
      const res = await api.get("/student-permits");
      setPermits(res.data.data || []);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Gagal mengambil data");
      }
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const formatTanggalIndo = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <h2 className="md:text-xl text-md text-black/30 font-bold mb-2">
        Laporan Izin Terbaru
      </h2>
      <div className="overflow-auto rounded-lg bg-white/40 border border-white/50">
        <Table className="bg-[#FFFFFF]/90 shadow-xl rounded-lg">
          <TableHeader className="sticky z-10 bg-[#FFFFFF]/90 top-0">
            <TableRow>
              <TableHead className="text-gray-400 font-bold text-xl">
                Waktu
              </TableHead>
              <TableHead className="text-gray-400 font-bold text-xl">
                NIS
              </TableHead>
              <TableHead className="text-gray-400 font-bold text-xl">
                Nama
              </TableHead>
              <TableHead className="text-gray-400 font-bold text-xl">
                Kelas
              </TableHead>
              <TableHead className="text-gray-400 font-bold text-xl">
                Alasan
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permits.length > 0 ? (
              permits.slice(0, 4).map((permission) => (
                <Dialog key={permission.id}>
                  <DialogTrigger asChild>
                    <TableRow>
                      <TableCell className="text-gray-600 font-medium text-lg">
                        {formatTanggalIndo(permission.created_at)}
                      </TableCell>

                      <TableCell className="text-gray-600 font-medium text-lg">
                        <p>
                          {permission.students.length > 2
                            ? permission.students[0].nis +
                              ", " +
                              permission.students[1].nis +
                              "   ... "
                            : permission.students
                                ?.map((s) => s.nis)
                                .join(", ") || "-"}
                        </p>
                      </TableCell>

                      <TableCell className="text-gray-600 font-medium text-lg">
                        <p>
                          {permission.students.length > 1
                            ? permission.students[0].name + "   ... "
                            : permission.students[0].name}
                        </p>
                      </TableCell>

                      <TableCell className="text-gray-600 font-medium text-lg">
                        {permission.students &&
                          [
                            ...new Set(permission.students.map((s) => s.class)),
                          ].join(", ")}
                      </TableCell>
                      <TableCell className="text-gray-600 font-medium text-lg">
                        {permission.reason}
                      </TableCell>
                    </TableRow>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] border-l-8 border-[#00786E] p-6 bg-white rounded-xl shadow-2xl">
                    <DialogHeader className="space-y-1">
                      <div className="flex flex-col gap-1">
                        <DialogTitle className="text-2xl font-extrabold text-gray-800 leading-tight">
                          Daftar Siswa Izin
                        </DialogTitle>
                        <span className="text-sm font-medium text-[#00786E] bg-[#00786E]/10 w-fit px-3 py-1 rounded-full">
                          📅 {formatTanggalIndo(permission.created_at)}
                        </span>
                      </div>

                      <div className="h-[5px] w-full bg-gray-100 " />

                      <DialogDescription asChild>
                        <div className="">
                          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            Nama Siswa & Kelas
                          </h4>

                          {/* Container Daftar Siswa */}
                          <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                            {permission.students?.map((s, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-white hover:shadow-sm transition-all group"
                              >
                                <div className="shrink-0 w-8 h-8 bg-[#00786E] text-white flex items-center justify-center rounded-full text-xs font-bold">
                                  {i + 1}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-semibold text-gray-700 group-hover:text-[#00786E]">
                                    {s.name}
                                  </span>
                                  <span className="text-[11px] font-medium text-gray-400">
                                    Kelas: {s.class}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-6 p-4 bg-[#00786E]/80 rounded-xl border border-amber-100">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-white text-lg">📝</span>
                              <span className="text-xs font-bold text-white uppercase">
                                Alasan Izin:
                              </span>
                            </div>
                            <p className="text-sm text-white leading-relaxed font-medium italic">
                              {permission.reason}
                            </p>
                          </div>
                        </div>
                      </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 flex justify-end">
                      <DialogClose asChild>
                        <Button className="bg-[#00786E] hover:bg-[#005f57] text-white px-6 font-bold rounded-lg shadow-md transition-all">
                          Selesai Membaca
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center h-24 text-gray-500"
                >
                  {loadingData ? <SkeletonText /> : "Tidak ada data izin"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
