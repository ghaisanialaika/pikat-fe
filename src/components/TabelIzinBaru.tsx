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
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { SkeletonText } from "./sekeleton/SekeletonText";

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
      <div className="overflow-auto h-[250px] rounded-lg ">
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
                <TableRow key={permission.id}>
                  <TableCell className="text-gray-600 font-medium text-lg">
                    {formatTanggalIndo(permission.created_at)}
                  </TableCell>

                  <TableCell className="text-gray-600 font-medium text-lg">
                     <Dialog>
                      <DialogTrigger>
                        <p>
                          { permission.students.length > 2 ?  permission.students[0].nis +", " + permission.students[1].nis + "   ... "   : permission.students?.map((s) => s.nis).join(", ") || "-"}
                        </p>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Nama-nama siswa izin <br /> {formatTanggalIndo(permission.created_at)} </DialogTitle>
                          <DialogDescription  className="flex flex-col text-md justify-start">
                              {permission.students?.map((s, i) => (
                                <span key={i}>-[{s.class}] {s.name}</span>
                              ))}

                              <span className="flex">
                                dengan alasan : <strong>{permission.reason}</strong>
                              </span>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </TableCell>

                  <TableCell className="text-gray-600 font-medium text-lg">
                    <Dialog>
                      <DialogTrigger>
                        <p>
                          {permission.students.length > 1
                            ? permission.students[0].name + "   ... "
                            : permission.students[0].name}
                        </p>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Nama-nama siswa izin <br /> {formatTanggalIndo(permission.created_at)} </DialogTitle>
                          <DialogDescription  className="flex flex-col text-md justify-start">
                              {permission.students?.map((s, i) => (
                                <span key={i}>-[{s.class}] {s.name}</span>
                              ))}

                              <span className="flex">
                                dengan alasan : <strong>{permission.reason}</strong>
                              </span>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
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
