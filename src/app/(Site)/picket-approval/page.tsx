"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/axios";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

interface UserAuth {
  id: number;
  username: string;
  fullname: string;
  roles: string[];
}

interface Student {
  nis: string;
  name: string;
  class: string;
}

interface UserRef {
  id: number;
  fullname: string;
  username: string;
}

interface StudentPermit {
  id: number;
  students: Student[];
  mapel: UserRef;
  piket: UserRef;
  status: "pending" | "approved" | "rejected";
  reason: string;
  hours_start: number;
  hours_end: number | null;
  created_at: string;
  updated_at: string;
}

const formatStatus = (status: string) => {
  return status
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

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

export default function PicketApproval() {
  const [loadingData, setLoadingData] = useState(true);
  const [user, setUser] = useState<UserAuth>();
  const [permits, setPermits] = useState<StudentPermit[]>([]);
  const router = useRouter();

  const formatTanggalIndo = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchMapelPermits = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await api.get("/student-permits/piket/ready-to-approve", {
        withCredentials: true,
      });
      setPermits(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data antrian");
    } finally {
      setLoadingData(false);
    }
  }, []);

  const processPermit = async (id: number, action: "APPROVED" | "REJECTED") => {
    try {
      await api.patch(
        `/student-permits/${id}/process/piket`,
        { status: action },
        { withCredentials: true },
      );
      toast.success(action === "APPROVED" ? "Izin disetujui" : "Izin ditolak");
      fetchMapelPermits();
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message || "Gagal memproses izin");
      }
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authRes = await api.get("/auth/me", { withCredentials: true });
        setUser(authRes.data.data);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          router.replace("/login");
        }
      }
    };

    fetchUser();
    fetchMapelPermits();
  }, [fetchMapelPermits, router]);

  return (
    <div className="bg-white/60 w-full h-full rounded-lg shadow-md p-5 space-y-2 overflow-hidden flex flex-col">
      <div className="text-4xl font-bold text-gray-600 drop-shadow-2xl mb-5">
        Dashboard
        {user && (
          <span className="ml-2">
            {user.fullname}{" "}
            <span className="text-sm text-gray-400 font-normal">
              ({user.roles.join(", ")})
            </span>
          </span>
        )}
      </div>

      <div className="bg-white/90 rounded-lg shadow-md p-4 flex-1 overflow-auto">
        <h2 className="text-xl font-bold text-gray-600 mb-3">
          Antrian Surat Izin (Piket)
        </h2>

        <Table className="bg-[#FFFFFF]/90 shadow-xl rounded-lg">
          <TableHeader className="sticky z-10 bg-[#FFFFFF]/90 top-0">
            <TableRow>
              <TableHead className="font-bold text-gray-500 text-lg">
                NIS
              </TableHead>
              <TableHead className="font-bold text-gray-500 text-lg">
                Nama
              </TableHead>
              <TableHead className="font-bold text-gray-500 text-lg">
                Kelas
              </TableHead>
              <TableHead className="font-bold text-gray-500 text-lg">
                Jam
              </TableHead>
              <TableHead className="font-bold text-gray-500 text-lg">
                Alasan
              </TableHead>
              <TableHead className="font-bold text-gray-500 text-lg">
                Mapel
              </TableHead>
              <TableHead className="font-bold text-gray-500 text-lg">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {permits.map((permit) => (
              <Dialog key={permit.id}>
                <DialogTrigger asChild>
                  <TableRow>
                    <TableCell>{permit.students[0].nis || "-"}</TableCell>
                    <TableCell>{permit.students[0].name || "N/A"}</TableCell>
                    <TableCell>{permit.students[0].class || "-"}</TableCell>
                    <TableCell>
                      {permit.hours_start} - {permit.hours_end || "Selesai"}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {permit.reason}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {permit.mapel.fullname}
                    </TableCell>
                    <TableCell className="flex gap-2">
                      {/* <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => processPermit(permit.id, "APPROVED")}
                      >
                        Setujui
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => processPermit(permit.id, "REJECTED")}
                      >
                        Tolak
                      </Button> */}

                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                          permit.status,
                        )}`}
                      >
                        {formatStatus(permit.status)}
                      </span>
                    </TableCell>
                  </TableRow>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] border-l-8 border-[#00786E] p-2 sm:p-6 bg-white rounded-xl shadow-2xl">
                  <div className="flex flex-col items-center gap-1">
                    <DialogTitle className="text-2xl font-extrabold text-gray-800 leading-tight">
                      Daftar Siswa Izin
                    </DialogTitle>
                    <span className="text-sm font-medium text-[#00786E] bg-[#00786E]/10 w-fit px-3 py-1 rounded-full">
                      📅 {formatTanggalIndo(permit.created_at)}
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
                        {permit.students?.map((s, i) => (
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
                          {permit.reason}
                        </p>
                      </div>

                      {loadingData ? (
                        <div className="h-15 bg-[#005f57]/80 hover:bg-[#005f57] rounded-md text-white flex justify-center items-center">
                          <Loader2 className="animate-spin text-white" />
                        </div>
                      ) : (
                        <div className="flex w-full justify-between mt-2 ">
                          <Button
                            className="h-10 bg-[#005f57]/80 hover:bg-[#005f57] rounded-md text-white"
                            onClick={() => processPermit(permit.id, "APPROVED")}
                          >
                            TERIMA
                          </Button>
                          <Button
                            className="h-10 bg-[#005f57]/80 hover:bg-[#005f57] rounded-md text-white"
                            onClick={() => processPermit(permit.id, "REJECTED")}
                          >
                            TOLAK
                          </Button>
                        </div>
                      )}
                    </div>
                  </DialogDescription>
                </DialogContent>
              </Dialog>
            ))}
          </TableBody>
        </Table>

        {!loadingData && permits.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl">Tidak ada izin yang perlu diproses</p>
          </div>
        )}

        {loadingData && (
          <div className="w-full h-[200px] flex flex-col justify-center items-center text-gray-400">
            <Loader2 className="animate-spin mb-2" size={40} />
            <p>Memuat data...</p>
          </div>
        )}
      </div>
    </div>
  );
}
