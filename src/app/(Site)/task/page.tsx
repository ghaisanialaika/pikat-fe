"use client";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  BatteryWarning,
  BookOpen,
  Loader2,
  User,
} from "lucide-react"; // Untuk indikator loading
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: number;
  username: string;
  fullname: string;
  nip: string | null;
  roles?: string[];
  created_at: string;
  updated_at: string;
}

interface Assignment {
  id: number;
  assignment_details: string;
  reason: string;
  due_date: string;
  created_at: string;
  updated_at: string;

  teacher: {
    id: number;
    username: string;
    fullname: string;
  };

  class: {
    id: number;
    class: string;
  };

  subject: {
    id: number;
    name: string;
  };
}

interface Class {
  id: number;
  class: string;
}

interface Subject {
  id: number;
  name: string;
}

const formatTanggalIndo = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function Task() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const classRef = useRef<string>("");
  const subjectRef = useRef<string>("");
  const reasonRef = useRef<HTMLInputElement>(null);
  const detailRef = useRef<HTMLInputElement>(null);
  const dueDateRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [form, setForm] = useState({
    teacher_user_id: "",
    class_id: "",
    subject_id: "",
    assignment_details: "",
    reason: "",
    due_date: "",
  });

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/teacher-assignments", {
        withCredentials: true,
      });
      setAssignments(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/classes?limit=10000");
      setClasses(res.data.data);
      setLoading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Gagal mengambil data");
      }
    }
  };

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await api.get("/subjects?limit=10000");
      setSubjects(res.data.data);
      setLoading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Gagal mengambil data");
      }
    }
  };

  const deleteAssignment = async (id: number) => {
    try {
      setLoading(true);
      await api.delete(`/teacher-assignments/${id}`, { withCredentials: true });
      toast.success("Tugas berhasil diselesaikan");
      fetchAssignments();
    } catch (err) {
      toast.error("Gagal menghapus tugas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.get("/auth/me");
        const user = res.data.data;
        setCurrentUser(user);

        if (!user.roles?.includes("admin") && !user.roles?.includes("mapel")) {
          router.replace("/dashboard");
          return;
        }

        fetchAssignments();
        fetchClasses();
        fetchSubjects();
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data.message || "Gagal mengambil data user",
          );
          router.replace("/login");
        }
      }
    };

    init();
  }, [router]);

  const handleSubmit = async () => {
    const classId = classRef.current;
    const subjectId = subjectRef.current;
    const reason = reasonRef.current?.value;
    const details = detailRef.current?.value;
    const dueDate = dueDateRef.current?.value;

    if (!classId || !subjectId || !reason || !details || !dueDate) {
      toast.warning("Lengkapi semua data tugas");
      return;
    }

    try {
      setLoading(true);
      await api.post("/teacher-assignments", {
        teacher_user_id: currentUser?.id,
        class_id: Number(classId),
        subject_id: Number(subjectId),
        assignment_details: details,
        reason: reason,
        due_date: new Date(dueDate).toISOString(),
      });

      toast.success("Tugas berhasil dititipkan");

      if (reasonRef.current) reasonRef.current.value = "";
      if (detailRef.current) detailRef.current.value = "";
      if (dueDateRef.current) dueDateRef.current.value = "";

      fetchAssignments();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Gagal menitipkan tugas");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/60 w-full h-full rounded-lg shadow-md pt-5 flex flex-col">
      <h1 className="text-4xl px-6 font-bold text-gray-600 drop-shadow-2xl">
        Tugas
      </h1>

      <div className="p-2">
        <div className="">
          <div className="flex items-center gap-2 text-gray-500">
            <Dialog>
              <DialogTrigger
                asChild
                className="px-8 p-2 mx-2 font-semibold cursor-pointer bg-[#005f57]/80 hover:bg-[#005f57] rounded-md text-white flex justify-center items-center"
              >
                <p>TITIP TUGAS</p>
              </DialogTrigger>
              <DialogContent showCloseButton={false}>
                <DialogTitle className="px-5 p-2 font-bold bg-[#005f57]/80 rounded-md text-white flex justify-center items-center">
                  <p>TITIP TUGAS</p>
                </DialogTitle>
                <DialogHeader>
                  {/* Untuk Select: Karena Radix Select bukan native input, kita simpan di ref string */}

                  <Label>Kelas</Label>
                  <Select onValueChange={(val) => (classRef.current = val)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Pilih Kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((c) => (
                        <SelectItem value={String(c.id)} key={c.id}>
                          {c.class}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Label>Mata Pelajaran</Label>
                  <Select onValueChange={(val) => (subjectRef.current = val)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Pilih Kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((c) => (
                        <SelectItem value={String(c.id)} key={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Untuk Input: Gunakan property ref */}
                  <Label>Alasan</Label>
                  <Input
                    ref={reasonRef}
                    type="text"
                    placeholder="Contoh: Rapat"
                    className="w-full"
                  />

                  <Label>Tugas</Label>
                  <Input
                    ref={detailRef}
                    type="text"
                    placeholder="Detail tugas..."
                    className="w-full"
                  />

                  <Label>Tenggat Waktu</Label>
                  <Input
                    ref={dueDateRef}
                    type="datetime-local"
                    className="w-full text-gray-700"
                  />
                  <Button onClick={() => handleSubmit()} className="bg-[#00786E]/60 text-white font-bold hover:bg-[#00786E] hover:text-white transition-all"> {loading ? <Loader2 className="animate-spin h-5 w-5 text-2xl" /> : "TITIP"}</Button>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="w-full h-150  flex justify-center items-center gap-2 text-gray-500">
              <Loader2 className="animate-spin h-5 w-5 text-2xl" />
              <span>Mengambil tugas Guru</span>
            </div>
          ) : (
            <div className="w-full h-full gap-2 text-gray-500 rounded-lg p-1 flex justify-center items-center overflow-hidden mt-5">
              <div className="flex w-full flex-col sm:flex-row gap-3  p-2 h-full justify-start items-center">
                {assignments.length > 0 ? (
                  assignments.map((note) => (
                    <Dialog key={note.id}>
                      <DialogTrigger asChild>
                        <Card
                          key={note.id}
                          className="w-full min-w-[225px] border-l-4 border-l-[#00786E] h-full bg-black/15 border-y-0 border-r-0 shadow-sm hover:shadow-md transition-all whitespace-normal"
                        >
                          <CardContent className="p-3 flex flex-col h-full justify-between">
                            <div>
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <span className="bg-[#00786E]/60 text-white text-xs font-bold px-2 py-0.5 rounded mr-2">
                                    {note.class?.class}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-400">
                                  {formatTanggalIndo(note.created_at)}
                                </span>
                              </div>
                              <div className="text-xs text-gray-400 font-semibold mt-1">
                                Deadline: {formatTanggalIndo(note.due_date)}
                              </div>

                              <div className="flex space-x-4">
                                <div className="flex items-center gap-2 mb-1">
                                  <BookOpen
                                    size={16}
                                    className="text-[#007D72]"
                                  />
                                  <p className="font-bold text-gray-700 text-sm">
                                    {note.subject?.name}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <User size={16} className="text-gray-400" />
                                <p className="text-xs text-gray-500">
                                  {note.teacher?.fullname}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <BatteryWarning
                                  size={16}
                                  className="text-gray-400"
                                />
                                <p className="text-xs text-gray-500">
                                  {note.reason}
                                </p>
                              </div>
                            </div>
                            <ScrollArea className="text-sm text-gray-600 bg-white p-2 rounded border border-yellow-100 italic h-15 whitespace-normal">
                              {note.assignment_details}
                            </ScrollArea>
                          </CardContent>
                        </Card>
                      </DialogTrigger>

                      <DialogContent
                        showCloseButton={false}
                        className="border-l-5 border-l-[#00786E] bg-gray-100 border-y-0 border-r-0 shadow-sm hover:shadow-md transition-all whitespace-normal"
                      >
                        <DialogHeader>
                          <DialogTitle className="bg-[#00786E]/60 text-white text-xl font-bold px-2 py-0.5 rounded mr-2 justify-between flex">
                            <span>{note.class?.class}</span>{" "}
                            {formatTanggalIndo(note.created_at)}
                          </DialogTitle>

                          <DialogDescription
                            asChild
                            className="mt-2 flex flex-col space-y-4"
                          >
                            <div className="text-gray-700">
                              <span className="text-sm">
                                Deadline:{" "}
                                <strong>
                                  {formatTanggalIndo(note.due_date)}
                                </strong>
                              </span>

                              <div className="flex items-center gap-2 mb-1 mt-4">
                                <BookOpen
                                  size={25}
                                  className="text-[#007D72] font-bold"
                                />
                                <span className="font-bold text-gray-700 text-md">
                                  {note.subject?.name}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 mb-2">
                                <User
                                  size={25}
                                  className="text-[#007D72] font-bold"
                                />
                                <span className="text-md text-gray-700 font-bold">
                                  {note.teacher?.fullname}
                                </span>
                              </div>

                              <ScrollArea className="text-sm text-gray-600 bg-white p-2 rounded border border-yellow-100 italic h-30 whitespace-normal">
                                {note.assignment_details}
                              </ScrollArea>
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                        <div className="w-full flex justify-end gap-2">
                          <DialogClose asChild>
                            <Button className="bg-[#00786E]/60 text-white font-bold hover:bg-[#00786E]">
                              Tutup
                            </Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-50 text-gray-400">
                    {loading ? (
                      <Loader2
                        className="animate-spin mb-2 flex justify-center items-center"
                        size={50}
                      />
                    ) : (
                      <>
                        <AlertCircle className="mb-2" />
                        Belum ada tugas Dititip
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
