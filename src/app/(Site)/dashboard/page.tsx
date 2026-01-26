"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import TabelIzinBaru from "@/components/TabelIzinBaru";
import TabelTugasGuru from "@/components/TabelTugasGuru";
import JadwalPiket from "@/components/jadwalPiket";
import Waktu from "@/components/waktu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { SkeletonText } from "@/components/sekeleton/SekeletonText";
import { Loader2, School } from "lucide-react";

interface StudentPermit {
  id: number;
  status: "pending" | "approved" | "rejected";
  reason: string;
  hours_start: number;
  hours_end: number;
  created_at: string;
  mapel: {
    id: number;
    name: string;
    username: string;
    fullname: string;
  };

  piket: {
    id: number;
    name: string;
    username: string;
    fullname: string;
  };

  students: {
    nis: number;
    name: string;
    class: string;
  }[];
}

interface UserAuth {
  id: number;
  username: string;
  fullname: string;
  roles: string[];
}

interface Staff {
  id: number;
  teacher: {
    id: number;
    username: string;
    fullname: string;
  };
  day_of_week: number;
  day_name: string;
}

interface UserAuth {
  id: number;
  username: string;
  fullname: string;
  roles: string[];
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

const formatStatus = (status: string) => {
  return status
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

export default function DashPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserAuth>();
  const [piketStaff, setPiketStaff] = useState<Staff[]>([]);

  const isAdmin = user?.roles?.includes("admin");
  const isPiket = user?.roles?.includes("piket");
  const isMapel = user?.roles?.includes("mapel");
  const isSatpam = user?.roles?.includes("satpam");

  const [loadingData, setLoadingData] = useState(true);
  const [time, setTime] = useState(new Date());

  const [permits, setPermits] = useState<StudentPermit[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMapelPermits = async () => {
    setLoading(true);
    try {
      const res = await api.get("/student-permits/mapel/pending", {
        withCredentials: true,
      });
      setPermits(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTanggalIndo = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const processPermit = async (
    id: number,
    action: "PENDING_PIKET" | "REJECTED",
  ) => {
    setLoading(true);
    try {
      await api.patch(
        `/student-permits/${id}/process/mapel`,
        { status: action },
        { withCredentials: true },
      );

      toast.success(
        action === "PENDING_PIKET" ? "Izin disetujui" : "Izin ditolak",
      );

      fetchMapelPermits();
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    if (isMapel) fetchMapelPermits();
  }, [isMapel]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoadingData(true);
      try {
        const authRes = await api.get("/auth/me", {
          withCredentials: true,
        });
        setUser(authRes.data.data);
        const [piketRes] = await Promise.allSettled([
          api.get("/piket-schedules"),
        ]);
        if (piketRes.status === "fulfilled")
          setPiketStaff(piketRes.value.data.data || []);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          console.warn("Unauthorized, redirecting to login");
          router.replace("/login");
        }
      } finally {
        setLoadingData(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const formattedTime = time
    .toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    .replace(".", ".");
  const formattedDate = time.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
  const formattedYear = time.getFullYear();

  const todayDay = new Date().getDay();

  const todayPiketStaff = piketStaff.filter(
    (staff) => staff.day_of_week === todayDay,
  );

  const todayName = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
  });

  return (
    <>
      <div className="-mb-5 ml-3">
        <h1 className="text-3xl font-bold text-gray-700 flex items-center gap-3">
          <div className="p-2 bg-[#007D72]/10 rounded-lg">
            <School className="text-[#007D72]" size={32} />
          </div>
          Dashboard
        </h1>
      </div>
      <div className="bg-white/60 w-full  rounded-lg shadow-md p-5 space-y-2 flex flex-col">
        {(isAdmin || isPiket) && (
          <>
            {/* <h1 className="text-4xl font-bold text-gray-600 drop-shadow-2xl">
              Dashboard
              {user && (
                <span>
                  {" "}
                  {user.fullname}{" "}
                  <span className="text-sm text-gray-400">
                    ({user.roles.join(", ")})
                  </span>
                </span>
              )}
            </h1> */}
            <TabelIzinBaru />

            <div className="flex flex-col md:flex-row gap-5  flex-1 min-h-0">
              <JadwalPiket
                todayName={todayName}
                todayPiketStaff={todayPiketStaff}
                loadingData={loadingData}
              />

              <div className="space-y-5 flex md:flex-col flex-col md:space-y-5 flex-1 min-w-0">
                <Waktu
                  formattedTime={formattedTime}
                  formattedDate={formattedDate}
                  formattedYear={formattedYear}
                />

                <TabelTugasGuru />
              </div>
            </div>
          </>
        )}

        {isMapel && (
          <div>
            <h2 className="text-2xl font-bold text-gray-600 drop-shadow-2xl mb-5">
              Antrian Surat Izin (Mapel)
            </h2>

            <Table className="bg-[#FFFFFF]/90 shadow-xl rounded-lg">
              <TableHeader className="sticky z-10 bg-[#FFFFFF]/90 top-0">
                <TableRow>
                  <TableHead className="font-bold text-gray-500 text-lg">
                    Nama
                  </TableHead>
                  <TableHead className="font-bold text-gray-500 text-lg">
                    Kelas
                  </TableHead>
                  <TableHead className="font-bold text-gray-500 text-lg">
                    Alasan
                  </TableHead>
                  <TableHead className="font-bold text-gray-500 text-lg">
                    Status
                  </TableHead>
                  <TableHead className="font-bold text-gray-500 text-lg">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {permits.length > 0 ? (
                  permits.slice(0, 4).map((permission) => (
                    <Dialog key={permission.id}>
                      <DialogTrigger asChild>
                        <TableRow className="hover:bg-white/60 transition-colors">
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
                                ...new Set(
                                  permission.students.map((s) => s.class),
                                ),
                              ].join(", ")}
                          </TableCell>
                          <TableCell className="text-gray-600 font-medium italic">
                            {permission.reason}
                          </TableCell>
                          <TableCell className="text-gray-600 font-medium">
                            {permission.mapel.fullname}
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
                      <DialogContent className="sm:max-w-[425px] border-l-8 border-[#00786E] p-2 sm:p-6 bg-white rounded-xl shadow-2xl">
                        <AlertDialogHeader className="space-y-1">
                          <div className="flex flex-col items-center gap-1">
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

                              {loading ? (
                                <div className="h-15 flex justify-center items-center  rounded-md text-white">
                                  <Loader2 className="animate-spin text-black" />
                                </div>
                              ) : (
                                <div className="flex w-full justify-between mt-2 ">
                                  <Button
                                    className="h-10 bg-[#005f57]/80 hover:bg-[#005f57] rounded-md text-white"
                                    onClick={() =>
                                      processPermit(
                                        permission.id,
                                        "PENDING_PIKET",
                                      )
                                    }
                                  >
                                    TERIMA
                                  </Button>
                                  <Button
                                    className="h-10 bg-[#005f57]/80 hover:bg-[#005f57] rounded-md text-white"
                                    onClick={() =>
                                      processPermit(permission.id, "REJECTED")
                                    }
                                  >
                                    TOLAK
                                  </Button>
                                </div>
                              )}
                            </div>
                          </DialogDescription>
                        </AlertDialogHeader>

                        {/* <div className="mt-4 flex justify-end">
                          <DialogClose asChild>
                            <Button className="bg-[#00786E] hover:bg-[#005f57] text-white px-6 font-bold rounded-lg shadow-md transition-all">
                              Tutup
                            </Button>
                          </DialogClose>
                        </div> */}
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

            {!loading && permits.length === 0 && (
              <p className="text-center text-gray-400 mt-5">
                Tidak ada izin pending
              </p>
            )}
          </div>
        )}

        {isSatpam && (
          <div>
            <h2 className="text-2xl font-bold text-gray-600 drop-shadow-2xl mb-5">
              Antrian Surat Izin (Mapel)
            </h2>
          </div>
        )}
      </div>
    </>
  );
}
