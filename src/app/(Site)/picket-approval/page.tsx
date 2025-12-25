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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

  student: {
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

  const fetchMapelPermits = async () => {
    setLoadingData(true);
    try {
      const res = await api.get("/student-permits/piket/ready-to-approve", {
        withCredentials: true,
      });
      setPermits(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  
  const processPermit = async (
    id: number,
    action: "APPROVED" | "REJECTED"
  ) => {
    try {
      await api.patch(
        `/student-permits/${id}/process/piket`,
        { status: action },
        { withCredentials: true }
      );
      
      toast.success(
        action === "APPROVED" ? "Izin disetujui" : "Izin ditolak"
      );
      
      fetchMapelPermits();
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      }
    }
  };
  useEffect(() => {
    if (user?.roles?.includes("piket")) {
      router.replace("/dashboard");
    }
      fetchMapelPermits();
  }, []);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoadingData(true);
      try {
        const authRes = await api.get("/auth/me", {
          withCredentials: true,
        });
        setUser(authRes.data.data);
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
                  <TableCell>{permit.student.nis}</TableCell>
                  <TableCell>{permit.student.name}</TableCell>
                  <TableCell>{permit.student.class}</TableCell>
                  <TableCell>
                    {permit.hours_start} - {permit.hours_end}
                  </TableCell>
                  <TableCell className="line-clamp-2">
                    {permit.reason}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => processPermit(permit.id, "APPROVED")}
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

          {!loadingData && permits.length === 0 && (
            <p className="text-center text-2xl   text-gray-400 mt-5">
              Tidak ada izin pending
            </p>
          )}
        </div>
      </h1>
    </div>
  );
}
