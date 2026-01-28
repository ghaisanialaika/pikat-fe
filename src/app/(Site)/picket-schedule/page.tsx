"use client";

import SkeletonJadwal from "@/components/sekeleton/skeletonJadwal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { Plus, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

interface Teacher {
  id: number;
  fullname: string;
}

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
  [key: string]: ScheduleItem[];
}

interface UserAuth {
  id: number;
  username: string;
  fullname: string;
  roles: string[];
  nip: string;
}

const daysOrder = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

export default function ReportPage() {
  const [scheduleData, setScheduleData] = useState<GroupedSchedule>({});
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");

  const year = new Date().getFullYear();
  const [user, setUser] = useState<UserAuth>();

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    const oldData = { ...scheduleData };

    const sourceItems = Array.from(scheduleData[source.droppableId]);
    const destItems = Array.from(scheduleData[destination.droppableId]);
    const [movedItem] = sourceItems.splice(source.index, 1);
    
    destItems.splice(destination.index, 0, movedItem);

    setScheduleData({
      ...scheduleData,
      [source.droppableId]: sourceItems,
      [destination.droppableId]: destItems,
    });

    const dayMapping: Record<string, number> = {
      Senin: 1,
      Selasa: 2,
      Rabu: 3,
      Kamis: 4,
      Jumat: 5,
    };

    try {
      await api.put(`/piket-schedules/${movedItem.id}`, {
        teacher_user_id: movedItem.teacher.id,
        day_of_week: dayMapping[destination.droppableId],
      });

      toast.success("Jadwal sinkron!");
    } catch (error) {
      setScheduleData(oldData);
      toast.error("Gagal sinkronisasi ke server, posisi dikembalikan.");
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get("/piket-schedules");
      const json = await res.data;

      if (json.success) {
        const grouped: GroupedSchedule = {};
        daysOrder.forEach((day) => (grouped[day] = []));

        json.data.forEach((item: ScheduleItem) => {
          if (!grouped[item.day_name]) {
            grouped[item.day_name] = [];
          }
          grouped[item.day_name].push(item);
        });
        setScheduleData(grouped);
      }
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await api.get("/users");
      setTeachers(res.data.data);
    } catch (error) {
      console.error("Failed to fetch teachers", error);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchData();
      try {
        const res = await api.get("/auth/me");
        const userData = res.data.data;
        setUser(userData);
        if (userData.roles.includes("admin")) {
          setIsAdmin(true);
          fetchTeachers();
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data.message || "Gagal mengambil data user",
          );
        }
      }
    };
    fetchInitialData();
  }, [fetchData]);

  const handleAddSchedule = async () => {
    if (!selectedTeacher || !selectedDay) {
      return toast.error("Pilih guru dan hari terlebih dahulu");
    }

    setIsSubmitting(true);
    try {
      await api.post("/piket-schedules", {
        teacher_user_id: parseInt(selectedTeacher),
        day_of_week: parseInt(selectedDay),
      });

      toast.success("Jadwal piket berhasil ditambahkan");
      setOpen(false);
      setSelectedTeacher("");
      setSelectedDay("");
      fetchData();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Gagal menambah jadwal");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10">
        <SkeletonJadwal />
      </div>
    );
  }

  return (
    <div className="bg-white/60 w-full h-full rounded-lg shadow-md p-1 sm:p-5 space-y-2 overflow-hidden flex flex-col">
      {/* Header Card */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {/* Kartu Header tetap sama */}
          <Card className="shadow-lg bg-jadwal text-white">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Image
                  src="/Logo_Smk.png"
                  alt="Logo Smk"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <span className="mx-2 text-2xl text-gray-500">|</span>
                <Image
                  src="/Logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <h2 className="text-4xl font-bold">JADWAL PIKET {year}</h2>
              <div className="mt-10 text-sm font-medium opacity-90">
                <p>Hubungi +62-8111-116-994</p>
                <p>jika ada yang ingin ditanyakan</p>
              </div>
            </CardContent>
          </Card>
          {daysOrder.map((day) => (
            <Droppable droppableId={day} key={day} isDropDisabled={!isAdmin}>
              {(provided) => (
                <Card
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="shadow-lg border-t-4 border-t-[#007D72]"
                >
                  <CardHeader>
                    <h2 className="text-3xl font-bold text-gray-700">{day}</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 min-h-[190px]">
                      {scheduleData[day]?.map((item, index) => (
                        <Draggable
                          key={item.id.toString()}
                          draggableId={item.id.toString()}
                          index={index}
                          isDragDisabled={!isAdmin}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-[#CAECE9] p-3 rounded-lg flex items-center shadow-sm ${
                                snapshot.isDragging
                                  ? "opacity-50 ring-2 ring-[#007D72]"
                                  : ""
                              }`}
                            >
                              <div className="w-2 h-8 bg-[#007D72] rounded-full mr-3"></div>
                              <p className="text-gray-700 font-medium">
                                {item.teacher.fullname}
                              </p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </CardContent>
                </Card>
              )}
            </Droppable>
          ))}
          {isAdmin && (
            <div className="flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl h-20">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2 text-slate-500 hover:text-[#007D72] hover:border-[#007D72] hover:bg-[#CAECE9] transition-all text-sm font-medium bg-white px-6 py-10 rounded-lg shadow-sm border border-slate-200 h-full w-full group">
                    <div className="bg-slate-50 group-hover:bg-[#CAECE9]/20 p-3 rounded-full transition-colors">
                      <Plus className="w-6 h-6" />
                    </div>
                    Tambah Jadwal Piket
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Tambah Jadwal Piket</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Pilih Guru</label>
                      <Select
                        onValueChange={setSelectedTeacher}
                        value={selectedTeacher}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih nama guru..." />
                        </SelectTrigger>
                        <SelectContent>
                          {teachers.map((t) => (
                            <SelectItem key={t.id} value={t.id.toString()}>
                              {t.fullname}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Pilih Hari Piket
                      </label>
                      <Select
                        onValueChange={setSelectedDay}
                        value={selectedDay}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih hari..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Senin</SelectItem>
                          <SelectItem value="2">Selasa</SelectItem>
                          <SelectItem value="3">Rabu</SelectItem>
                          <SelectItem value="4">Kamis</SelectItem>
                          <SelectItem value="5">Jumat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={() => setOpen(false)}
                      disabled={isSubmitting}
                    >
                      Batal
                    </Button>
                    <Button
                      className="bg-[#007D72] hover:bg-[#005f57]"
                      onClick={handleAddSchedule}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          Menyimpan...
                        </>
                      ) : (
                        "Simpan Jadwal"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </DragDropContext>

      {/* {daysOrder.map((day) => (
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
                        className="bg-[#CAECE9] p-3 rounded-lg w-full flex items-center shadow-sm"
                      >
                        <div className="w-2 h-8 bg-[#007D72] rounded-full mr-3"></div>
                        <p className="text-gray-700 font-medium text-sm sm:text-lg">
                          {teacherName.teacher?.fullname || "Guru"}
                          {isAdmin && (
                            <button
                              // onClick={() => handleDeleteSchedule(day, teacherName)}
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic text-sm">
                      Tidak ada jadwal
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ))} */}
    </div>
  );
}
