"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/axios";
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

interface StudentPermit {
  id: number;
  status: "pending" | "approved" | "rejected";
  reason: string;
  hours_start: number;
  hours_end: number;
  created_at: string;
  // Ubah menjadi optional agar aman saat pengecekan
  student?: {
    nis: number;
    name: string;
    class: string;
  };
}

export default function PicketApproval() {
  const [loadingData, setLoadingData] = useState(true);
  const [user, setUser] = useState<UserAuth>();
  const [permits, setPermits] = useState<StudentPermit[]>([]);
  const router = useRouter();

  // Gunakan useCallback untuk menghindari masalah dependency array di useEffect
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
        { withCredentials: true }
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
                {/* Gunakan Optional Chaining (?.) untuk mencegah error undefined */}
                <TableCell>{permit.student?.nis || "-"}</TableCell>
                <TableCell>{permit.student?.name || "N/A"}</TableCell>
                <TableCell>{permit.student?.class || "-"}</TableCell>
                <TableCell>
                  {permit.hours_start} - {permit.hours_end || "Selesai"}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {permit.reason}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button
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
                  </Button>
                </TableCell>
              </TableRow>
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