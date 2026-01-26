"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Filter, Loader2, Search } from "lucide-react";
import api from "@/lib/axios";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface StudentPermit {
  id: number;
  students: {
    nis: string;
    name: string;
    class: string;
  }[];
  mapel: {
    id: number;
    username: string;
    fullname: string;
  };
  piket?: {
    id: number;
    username: string;
    fullname: string;
  } | null;
  reason: string;
  status: string;
  hours_start: number;
  hours_end: number | null;
  created_at: string;
}

export default function ReportPage() {
  const [data, setData] = useState<StudentPermit[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/student-permits");
        setData(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching students permits:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    const matchesSearch = item.students
      ?.map((s) => s.name)
      .join(", ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    let matchesTime = true;
    const itemDate = new Date(item.created_at);
    const today = new Date();

    if (timeFilter === "today") {
      matchesTime = itemDate.toDateString() === today.toDateString();
    } else if (timeFilter === "week") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
      matchesTime = itemDate >= sevenDaysAgo;
    } else if (timeFilter === "month") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      matchesTime = itemDate >= thirtyDaysAgo;
    }

    return matchesSearch && matchesTime;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  const formatTanggalIndo = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatStatus = (status: string) => {
    return status
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="bg-white/60 w-full h-full rounded-lg shadow-md p-5 space-y-5 overflow-hidden flex flex-col">
      <h1 className="text-4xl font-bold text-gray-600 drop-shadow-2xl">
        Laporan Izin
      </h1>

      <div className="w-full bg-gray-200/50 p-2 rounded-lg flex flex-col md:flex-row items-center gap-2 text-gray-500">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Cari nama siswa..."
            className="h-10 pl-9 bg-white border-none shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="h-10 px-4 bg-[#007D72] hover:bg-[#007D72]/90 text-white w-full md:w-[200px] flex items-center justify-between rounded-lg border-none">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4 text-[007D72]" />
              <SelectValue placeholder="Filter Waktu" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Rentang Waktu</SelectLabel>
              <SelectItem value="all">Semua Data</SelectItem>
              <SelectItem value="today">Hari Ini</SelectItem>
              <SelectItem value="week">7 Hari Terakhir</SelectItem>
              <SelectItem value="month">30 Hari Terakhir</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-auto rounded-lg bg-white/40 border border-white/50">
        <Table className="bg-[#FFFFFF]/90 shadow-xl rounded-lg">
          <TableHeader className="sticky z-10 bg-[#FFFFFF]/90 top-0">
            <TableRow>
              <TableHead className="font-bold text-gray-500 text-lg">
                Tanggal
              </TableHead>
              <TableHead className="font-bold text-gray-500 text-lg">
                Siswa
              </TableHead>
              <TableHead className="font-bold text-gray-500 text-lg">
                Kelas
              </TableHead>
              <TableHead className="font-bold text-gray-500 text-lg">
                Alasan
              </TableHead>
              <TableHead className="font-bold text-gray-500 text-lg">
                Mapel
              </TableHead>
              <TableHead className="font-bold text-gray-500 text-lg">
                Piket
              </TableHead>
              <TableHead className="font-bold text-gray-500 text-lg">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-gray-600 font-medium w-full h-50"
                >
                  <div className="flex justify-center items-center gap-2 text-gray-500">
                    <Loader2 className="animate-spin" /> Memuat Data...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredData.length > 0 ? (
              filteredData.map((permit) => (
                <Dialog key={permit.id}>
                  <DialogTrigger asChild>
                    <TableRow className="hover:bg-white/60 transition-colors">
                      <TableCell className="text-gray-600 font-medium">
                        {formatDate(permit.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-700">
                            {permit.students.length > 1
                              ? permit.students[0].name + "   ... "
                              : permit.students
                                  ?.map((s) => s.name)
                                  .join(", ") || "-"}
                          </span>
                          <span className="text-xs text-gray-400">
                            {permit.students?.length} siswa
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 font-medium">
                        {permit.students &&
                          [
                            ...new Set(permit.students.map((s) => s.class)),
                          ].join(", ")}
                      </TableCell>
                      <TableCell className="text-gray-600 font-medium italic">
                        {permit.reason}
                      </TableCell>
                      <TableCell className="text-gray-600 font-medium">
                        {permit.mapel.fullname}
                      </TableCell>
                      <TableCell className="text-gray-600 font-medium">
                        {permit.piket?.fullname}
                      </TableCell>
                      <TableCell>
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

                  <DialogContent
                    showCloseButton={false}
                    className="sm:max-w-[425px] border-l-8 border-[#00786E] p-6 bg-white rounded-xl shadow-2xl"
                  >
                    <DialogHeader className="space-y-1">
                      <div className="flex flex-col gap-1">
                        <DialogTitle className="text-2xl font-extrabold text-gray-800 leading-tight">
                          Daftar Siswa Izin
                        </DialogTitle>
                        <div className="flex justify-between px-2">
                          <span className="text-sm font-medium text-[#00786E] bg-[#00786E]/10 w-fit px-3 py-1 rounded-full">
                            {formatTanggalIndo(permit.created_at)}
                          </span>
                          <span className="text-sm font-medium text-[#00786E] bg-[#00786E]/10 w-fit px-3 py-1 rounded-full">
                            {permit.status}
                          </span>
                        </div>
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
                        </div>
                      </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 flex justify-end">
                      <DialogClose asChild>
                        <Button className="bg-[#00786E] hover:bg-[#005f57] text-white px-6 font-bold rounded-lg shadow-md transition-all">
                          Tutup
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-gray-500 italic"
                >
                  Tidak ada data yang ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
