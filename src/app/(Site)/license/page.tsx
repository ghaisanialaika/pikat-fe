"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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

interface Teacher {
  id: number;
  username: string;
  fullname: string;
  nip: string;
  roles: string[];
}

interface Student {
  nis: string;
  name: string;
  class: string;
}

interface UserAuth {
  id: number;
  username: string;
  fullname: string;
  nip: number;
  roles: string[];
}

export default function LicensePage() {
  const router = useRouter();

  const [user, setUser] = useState<UserAuth | null>(null);
  const [petugas, setPetugas] = useState<Staff[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    student_nis: "",
    reason: "",
    hours_start: "",
    mapel_user_id: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const authRes = await api.get("/auth/me");
        setUser(authRes.data.data);

        const [studentRes, piketRes, teacherRes] = await Promise.all([
          api.get("/students?limit=10000"),
          api.get("/piket-schedules"),
          api.get("/users/mapel"),
        ]);

        setStudents(studentRes.data.data);
        setPetugas(piketRes.data.data);
        setTeachers(teacherRes.data.data);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          router.replace("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const todayDay = new Date().getDay() || 7;
  const todayPiketStaff = petugas.filter((p) => p.day_of_week === todayDay);

  const handleSubmit = async () => {
    if (
      !form.student_nis ||
      !form.hours_start ||
      !form.mapel_user_id ||
      !form.reason
    ) {
      toast.warning("Lengkapi semua data");
      return;
    }

    try {
      setLoading(true);

      await api.post("/student-permits", {
        student_nis: form.student_nis,
        reason: form.reason,
        hours_start: Number(form.hours_start),
        hours_end: null,
        mapel_user_id: Number(form.mapel_user_id),
      });

      toast.success("Izin siswa berhasil dikirim");

      setForm({
        student_nis: "",
        reason: "",
        hours_start: "",
        mapel_user_id: "",
      });
      setSelectedStudent(null);

      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Gagal mengirim izin");
      } else {
        toast.error("Terjadi kesalahan");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/60 w-full h-full rounded-lg shadow-md p-6 space-y-6">
      <h1 className="text-4xl font-bold text-gray-600">License Page</h1>

      <div className="bg-white/80 rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="">
            <Label>Nama Petugas</Label>
            <Input value={user?.fullname || ""} disabled />
          </div>

          <div>
            <Label>NIP Petugas</Label>
            <Input value={user?.nip || ""} disabled placeholder="Otomatis" />
          </div>

          <div>
            <Label>Tanggal</Label>
            <Input value={new Date().toLocaleDateString("id-ID")} disabled />
          </div>

          <Select
            onValueChange={(val) =>
              setForm((f) => ({ ...f, hours_start: val }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Jam ke-" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(15)].map((_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {selectedStudent
                  ? `${selectedStudent.name} - ${selectedStudent.class}`
                  : "Cari Siswa..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Cari nama / NIS siswa..." />
                <CommandEmpty>Siswa tidak ditemukan</CommandEmpty>

                <CommandGroup>
                  {students.map((s) => (
                    <CommandItem
                      key={s.nis}
                      value={`${s.name} ${s.nis} ${s.class}`}
                      onSelect={() => {
                        setSelectedStudent(s);
                        setForm((f) => ({ ...f, student_nis: s.nis }));
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedStudent?.nis === s.nis
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {s.name} — {s.class} ({s.nis})
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <div>
            <Label>Nama Siswa</Label>
            <Input value={selectedStudent?.name || ""} disabled className="overflow-hidden" />
          </div>

          <div>
            <Label>Kelas</Label>
            <Input value={selectedStudent?.class || ""} disabled />
          </div>

          <Select
            onValueChange={(val) =>
              setForm((f) => ({ ...f, mapel_user_id: val }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Guru Mapel" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((t) => (
                <SelectItem key={t.id} value={t.id.toString()}>
                  {t.fullname}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Masukkan Deskripsi Izin"
            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
          />

          <Button
            className="col-span-1 md:col-span-2 self-end"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Kirim"}
          </Button>
        </div>
      </div>
    </div>
  );
}
