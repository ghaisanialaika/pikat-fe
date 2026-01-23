"use client";

import SkeletonJadwal from "@/components/sekeleton/skeletonJadwal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ScheduleItem {
  id: number;
  teacher: {
    id: number;
    username: string;
    fullname: string;
  };
  day_of_week: number;
  day_name: string;
}

interface GroupedSchedule {
  [key: string]: string[];
}

interface UserAuth {
  id: number;
  username: string;
  fullname: string;
  roles: string[];
  nip: string;
}

export default function ReportPage() {
  const [scheduleData, setScheduleData] = useState<GroupedSchedule>({});
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const year = new Date().getFullYear();


  const daysOrder = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
  const [user, setUser] = useState<UserAuth>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/piket-schedules"); 
        const json = await res.data;

        if (json.success) {

          const grouped: GroupedSchedule = {};

          daysOrder.forEach(day => grouped[day] = []);

          json.data.forEach((item: ScheduleItem) => {
            if (!grouped[item.day_name]) {
              grouped[item.day_name] = [];
            }
            grouped[item.day_name].push(item.teacher.fullname);
          });

          setScheduleData(grouped);
        }
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message || "Gagal mengambil data");
        }
      } 
    }
    fetchUser();
    fetchData();

    if (user?.roles.includes("admin")) {
      setIsAdmin(true);
    }
  }, [daysOrder, user?.roles]);

  if (loading) {
    return <div className="p-10"><SkeletonJadwal/></div>;
  }


  return (
    <div className="bg-white/60 w-full h-full rounded-lg shadow-md p-5 space-y-2 overflow-hidden flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {/* Header Card */}
        <Card className="shadow-lg bg-jadwal text-white">
          <CardContent>
            <div className="flex items-center">
              <Image
                src="/Logo_Smk.png"
                alt="Logo Smk"
                width={100}
                height={100}
                className="max-w-10"
              />
              <span className="mx-2 text-2xl text-gray-500">|</span>
              <Image
                src="/Logo.png"
                alt="Logo Smk"
                width={100}
                height={100}
                className="max-w-10"
              />
            </div>
            <h2 className="text-5xl font-bold">JADWAL PIKET {year}</h2>
            <div className="bottom-0 mt-10 text-lg font-medium ">
              <p>Hubungi +628111116 994</p>
              <p>jika ada yang ingin ditanyakan</p>
            </div>
          </CardContent>
        </Card>

        {daysOrder.map((day) => (
          <Card key={day} className="shadow-lg border-t-4 border-t-[#007D72]">
            <CardHeader>
              <h2 className="text-3xl font-bold text-gray-700">{day}</h2>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[190px] w-full pr-4">
                <div className="space-y-3">
                  {scheduleData[day]?.length > 0 ? (
                    scheduleData[day].map((teacherName, i) => (
                      <div
                        key={i}
                        className="bg-[#CAECE9] p-3 rounded-lg w-full flex items-center shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="w-2 h-8 bg-[#007D72] rounded-full mr-3"></div>
                        <p className="text-gray-700 font-medium text-sm sm:text-lg drop-shadow-sm">
                          {teacherName}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">Tidak ada jadwal</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
        <div className="">
          {isAdmin ? (
            <Button className="flex items-center gap-2 text-slate-500 hover:text-[#007D72] transition-colors text-sm font-medium bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
              <Plus className="w-4 h-4" />
              Tambah Jadwal Piket
            </Button>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}