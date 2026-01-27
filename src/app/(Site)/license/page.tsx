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
import { useEffect, useState, useCallback } from "react";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, X, Loader2, School } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

// --- Interfaces ---F
interface User {
  id: number;
  username: string;
  fullname: string;
  nip: string | null;
  roles?: string[];
}

interface Teacher {
  id: number;
  fullname: string;
}

interface Student {
  nis: string;
  name: string;
  class: string;
}


export default function LicensePage() {
  const router = useRouter();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedOfficer, setSelectedOfficer] = useState<User | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);   

  const [form, setForm] = useState({
    student_nis: [] as string[],
    reason: "",
    hours_start: "",
    hours_end: "",
    mapel_user_id: "",
  });

  const fetchData = useCallback(async () => {
    setLoadingInitial(true);
    try {
      const [studentRes, teacherRes, authRes] = await Promise.all([
        api.get("/students?limit=10000"),
        api.get("/users/mapel"),
        api.get("/auth/me"),
      ]);

      setStudents(studentRes.data.data);
      setTeachers(teacherRes.data.data);

      const currentUser = authRes.data.data;
      setSelectedOfficer(currentUser);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        router.replace("/login");
      } else {
        toast.error("Gagal mengambil data dari server");
      }
    } finally {
      setLoadingInitial(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleStudent = (s: Student) => {
    const isExist = selectedStudents.find((item) => item.nis === s.nis);
    let updated: Student[];
    if (isExist) {
      updated = selectedStudents.filter((item) => item.nis !== s.nis);
    } else {
      updated = [...selectedStudents, s];
    }
    setSelectedStudents(updated);
    setForm((f) => ({ ...f, student_nis: updated.map((i) => i.nis) }));
  };

  const handleSubmit = async () => {
    if (
      form.student_nis.length === 0 ||
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
        hours_end: form.hours_end ? Number(form.hours_end) : null,
        mapel_user_id: Number(form.mapel_user_id),
        piket_user_id: selectedOfficer?.id,
      });

      toast.success("Izin siswa berhasil dikirim");
      setForm({
        student_nis: [],
        reason: "",
        hours_start: "",
        mapel_user_id: "",
        hours_end: "",
      });
      setSelectedStudents([]);
      setSelectedOfficer(null);
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Gagal mengirim izin");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="-mb-5 ml-3">
        <h1 className="text-2xl font-bold text-gray-700 flex items-center gap-3">
          <div className="p-2 bg-[#007D72]/10 rounded-lg">
            <School className="text-[#007D72]" size={32} />
          </div>
          Surat Izin
        </h1>
      </div>
    <div className="bg-white/60 w-full h-full rounded-lg shadow-md p-6 space-y-6">

      <div className="bg-white/80 rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
          {/* <div className="flex flex-col space-y-2">
            <Label>Nama Petugas Piket </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between font-normal"
                  disabled={loading}
                >
                  {loadingTeachers ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : selectedOfficer ? (
                    selectedOfficer.fullname
                  ) : (
                    "Pilih Petugas Piket..."
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Cari nama petugas..." />
                  <CommandList>
                    <CommandEmpty>Petugas tidak ditemukan.</CommandEmpty>
                    <CommandGroup heading="Daftar Petugas Piket">
                      {allUsers.map((u) => (
                        <CommandItem
                          key={u.id}
                          onSelect={() => setSelectedOfficer(u)}
                          className="cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedOfficer?.id === u.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          <div className="flex flex-col">
                            <span>{u.fullname}</span>
                            <span className="text-[10px] text-muted-foreground uppercase bg-slate-100 w-fit px-1 rounded">
                              {u.roles?.join(" & ")}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            
          </div> */}
          <div className="flex flex-col space-y-2">
            <Label>Nama Petugas (Piket/Admin)</Label>
            <div className="relative">
              <Input
                value={
                  loadingInitial
                    ? "Memuat..."
                    : selectedOfficer?.fullname || "Tidak Terdeteksi"
                }
                disabled
                className="bg-gray-100 font-medium text-gray-700"
              />
              {loadingInitial && (
                <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-gray-400" />
              )}
            </div>
            <p className="text-[10px] text-muted-foreground italic">
              * Petugas otomatis terdeteksi dari akun Anda yang sedang login.
            </p>
          </div>

          <div>
            <Label>NIP Petugas</Label>
            <Input
              value={selectedOfficer?.nip || "-"}
              disabled
              placeholder="Otomatis"
            />
          </div>

          <div className="flex-col space-y-2">
            <Label>Tanggal</Label>
            <Input value={new Date().toLocaleDateString("id-ID")} disabled />
          </div>

          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex flex-col space-y-2">
              <Label>Guru Mapel</Label>
              <Select
                onValueChange={(val) =>
                  setForm((f) => ({ ...f, mapel_user_id: val }))
                }
                value={form.mapel_user_id}
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
            </div>
            <div className="flex flex-col space-y-2">
              <Label>Jam Ke-</Label>
              <Select
                onValueChange={(val) =>
                  setForm((f) => ({ ...f, hours_start: val }))
                }
                value={form.hours_start}
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
            <div className="flex flex-col space-y-2">
              <Label>Jam Selesai</Label>
              <Select
                onValueChange={(val) =>
                  setForm((f) => ({ ...f, hours_end: val }))
                }
                value={form.hours_end}
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
          </div>
        </div>
        <div className="space-y-4">
          <Label>Cari & Pilih Siswa (Bisa lebih dari 1)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {selectedStudents.length > 0
                  ? `${selectedStudents.length} Siswa Terpilih`
                  : "Cari Siswa..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
              <Command>
                <CommandInput placeholder="Cari nama / NIS siswa..." />
                <CommandList>
                  <CommandEmpty>Siswa tidak ditemukan</CommandEmpty>
                  <CommandGroup>
                    {students.map((s) => (
                      <CommandItem
                        key={s.nis}
                        onSelect={() => toggleStudent(s)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedStudents.some((x) => x.nis === s.nis)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {s.name} — {s.class}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <div className="flex flex-wrap gap-2">
            {selectedStudents.map((s) => (
              <Badge
                key={s.nis}
                variant="secondary"
                className="py-1 px-3 flex items-center gap-1"
              >
                {s.name} ({s.class})
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-500"
                  onClick={() => toggleStudent(s)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="flex flex-col space-y-2">
            <Label>Alasan Izin</Label>
            <Textarea
              placeholder="Masukkan Deskripsi Izin"
              value={form.reason}
              onChange={(e) =>
                setForm((f) => ({ ...f, reason: e.target.value }))
              }
            />
          </div>

          <Button
            className="col-span-1 md:col-span-2 w-full md:w-1/3 ml-auto bg-[#007D72] hover:bg-[#007D72]/90"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...
              </>
            ) : (
              "Kirim Izin"
            )}
          </Button>
        </div>
      </div>
    </div>
    </>
  );
}
