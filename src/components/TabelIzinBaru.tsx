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
  mapel: {
    id: number;
    username: string;
    fullname: string;
  };
  piket?: {
    id: number;
    username: string;
    fullname: string;
  } | null;
  status: string;
  reason: string;
  created_at: string;
}

const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700 border-green-200";

      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200";

      case "PENDING_PIKET":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "APPROVED_MAPEL":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";

      case "REJECTED_MAPEL":
        return "bg-orange-100 text-orange-700 border-orange-200";

      case "PENDING_MAPEL":
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

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

    const formatStatus = (status: string) => {
    return status
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
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
              <TableHead className="font-bold text-gray-500 text-lg">
                Tanggal
              </TableHead>
              <TableHead className="font-bold text-gray-500 text-lg">
                Siswa
              </TableHead>
              <TableHead className="font-bold text-gray-500 text-lg">
                Kelas
              </TableHead>
              <TableHead className="font-bold text-gray-500 text-lg">
                Alasan
              </TableHead>
              <TableHead className="font-bold text-gray-500 text-lg">
                Mapel
              </TableHead>
              <TableHead className="font-bold text-gray-500 text-lg">
                Piket
              </TableHead>
              <TableHead className="font-bold text-gray-500 text-lg">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permits.length > 0 ? (
              permits.slice(0, 4).map((permission) => (
                <Dialog key={permission.id}>
                  <DialogTrigger asChild>
                    <TableRow className="hover:bg-white/60 transition-colors">
                      <TableCell className="text-gray-600 font-medium">
                        {formatTanggalIndo(permission.created_at)}
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-700 text-md">
                            {permission.students.length > 1
                              ? permission.students[0].name + "   ... "
                              : permission.students
                                  ?.map((s) => s.name)
                                  .join(", ") || "-"}
                          </span>
                          <span className="text-xs text-gray-400">
                            {permission.students?.length} siswa
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 font-medium">
                        {permission.students &&
                          [
                            ...new Set(permission.students.map((s) => s.class)),
                          ].join(", ")}
                      </TableCell>
                      <TableCell className="text-gray-600 font-medium italic">
                        {permission.reason}
                      </TableCell>
                      <TableCell className="text-gray-600 font-medium">
                        {permission.mapel.fullname}
                      </TableCell>
                      <TableCell className="text-gray-600 font-medium">
                        {permission.piket?.fullname}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                            permission.status,
                          )}`}
                        >
                          {formatStatus(permission.status)}
                        </span>
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
                          Tutup
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
