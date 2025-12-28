"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookOpen, User, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import TabelIzinBaru from "@/components/TabelIzinBaru";
import TabelTugasGuru from "@/components/TabelTugasGuru";

interface StudentPermit {
  id: number;
  status: "pending" | "approved" | "rejected";
  reason: string;
  hours_start: number;
  hours_end: number;
  created_at: string;

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
interface Permission {
  id: number;
  students: {
    nis: number;
    name: string;
    class: string;
  }[];
  mapel: {
    id: number;
    username: string;
    fullname: string;
  };
  piket: {
    id: number;
    username: string;
    fullname: string;
  };
  status: string;
  reason: string;
  hours_start: number;
  hours_end: number;
  created_at: string;
  updated_at: string;
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

export default function DashPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserAuth>();
  const [piketStaff, setPiketStaff] = useState<Staff[]>([]);

  const isAdmin = user?.roles?.includes("admin");
  const isPiket = user?.roles?.includes("piket");
  const isMapel = user?.roles?.includes("mapel");

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

  const processPermit = async (
    id: number,
    action: "PENDING_PIKET" | "REJECTED"
  ) => {
    try {
      await api.patch(
        `/student-permits/${id}/process/mapel`,
        { status: action },
        { withCredentials: true }
      );

      toast.success(
        action === "PENDING_PIKET" ? "Izin disetujui" : "Izin ditolak"
      );

      fetchMapelPermits();
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      }
    }
  };

  // const openDetail = async (id: number) => {
  //   const res = await api.get(`/student-permits/${id}`);
  //   setSelectedPermit(res.data.data);
  // };

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
        const [ piketRes] = await Promise.allSettled([
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
    (staff) => staff.day_of_week === todayDay
  );

  const todayName = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
  });

  return (
    <div className="bg-white/60 w-full h-full rounded-lg shadow-md p-5 space-y-2 overflow-hidden flex flex-col">
      <h1 className="text-4xl font-bold text-gray-600 drop-shadow-2xl">
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
      </h1>

      {(isAdmin || isPiket) && (
        <>
          <TabelIzinBaru />

          <div className="flex flex-col md:flex-row gap-5 mt-5 flex-1 min-h-0">
            <div className="flex flex-col md:w-1/3">
              <h2 className="md:text-xl text-md text-black/30 font-bold ml-1">
                Petugas Piket Hari {todayName}
              </h2>

              <Card className="bg-[#FFFFFF]/90 shadow-md rounded-lg overflow-hidden h-full">
                <CardContent className="p-5">
                  <ScrollArea className="h-[300px] w-full pr-4">
                    <div className="space-y-2">
                      {todayPiketStaff.length > 0 ? (
                        todayPiketStaff.map((staff) => (
                          <div
                            key={staff.id}
                            className="bg-[#CAECE9] p-3 rounded-lg w-full flex items-center shadow-sm"
                          >
                            <p className="text-gray-600 font-medium text-lg drop-shadow-sm">
                              {staff.teacher?.fullname || "Guru"}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-400 mt-10">
                          {loadingData
                            ? "Loading..."
                            : "Tidak ada jadwal piket hari ini"}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-5 flex md:flex-col flex-col md:space-y-5 flex-1 min-w-0">
              <div className="w-full h-32 bg-[#00786E]/60 shadow-md rounded-lg p-8 flex justify-center items-center ">
                <p className="sm:text-6xl text-4xl md:text-8xl font-bold text-white">
                  {formattedTime}
                </p>
                <div className="ml-5 md:ml-10 flex flex-col">
                  <p className="text-3xl md:text-5xl font-bold text-white">
                    {formattedDate}
                  </p>
                  <p className="text-3xl md:text-5xl font-bold text-white">
                    {formattedYear}
                  </p>
                </div>
              </div>

              <TabelTugasGuru />
            </div>
          </div>
        </>
      )}

      {isMapel && (
        <div className="bg-white/90 rounded-lg shadow-md p-4 mt-5">
          <h2 className="text-xl font-bold text-gray-600 mb-3">
            Antrian Surat Izin (Mapel)
          </h2>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NIS</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Jam</TableHead>
                <TableHead>Alasan</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {permits.map((permit) => (
                <TableRow key={permit.id}>
                  {/* Gunakan optional chaining dan index [0] */}
                  <TableCell>{permit.students?.[0]?.nis || "-"}</TableCell>
                  <TableCell>{permit.students?.[0]?.name || "-"}</TableCell>
                  <TableCell>{permit.students?.[0]?.class || "-"}</TableCell>
                  <TableCell>
                    {permit.hours_start} - {permit.hours_end || "Selesai"}
                  </TableCell>
                  <TableCell className="line-clamp-2">
                    {permit.reason}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => processPermit(permit.id, "PENDING_PIKET")}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => processPermit(permit.id, "REJECTED")}
                    >
                      Tolak
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {!loading && permits.length === 0 && (
            <p className="text-center text-gray-400 mt-5">
              Tidak ada izin pending
            </p>
          )}
        </div>
      )}
    </div>
  );
}
