"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import {
  User as UserIcon,
  Save,
  ArrowLeft,
  School,
  Badge,
  Loader2,
  Shield,
  X,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EditTeacherPage() {
  const { id } = useParams();
  const router = useRouter();
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [rolesList, setRolesList] = useState<{ id: number; name: string }[]>(
    [],
  );

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    nip: "",
    currentRoles: [] as string[],
    selectedRoleId: "",
  });

  const loadRolesList = async () => {
    try {
      const res = await api.get(`/roles`);
      setRolesList(res.data.data);
    } catch (err) {
      console.error("Gagal memuat daftar role:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await loadRolesList();
        const res = await api.get(`/users/${id}`);
        const data = res.data.data;

        setFormData({
          fullname: data.fullname || "",
          username: data.username || "",
          nip: data.nip || "",
          currentRoles: data.roles || [],
          selectedRoleId: "",
        });
      } catch (err) {
        if (err instanceof AxiosError) {
          toast.error(err.response?.data.message);
          router.push("/view-data/teacher-data");
        }
      } finally {
        setFetching(false);
      }
    };
    loadData();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/users/${id}`, {
        fullname: formData.fullname,
        username: formData.username,
        nip: formData.nip,
      });
      toast.success("Data berhasil diperbarui!");
      router.push("/view-data/teacher-data");
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Gagal memperbarui data");
      }
    } finally {
      setLoading(false);
    }
  };

  const getRoleIdByName = (roleName: string) => {
    return rolesList.find(
      (r) => r.name.toLowerCase() === roleName.toLowerCase(),
    )?.id;
  };

  const handleDeleteRole = async (roleName: string) => {
    const roleId = getRoleIdByName(roleName);

    if (!roleId) {
      toast.error("ID Role tidak ditemukan");
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/user-roles/${id}/${roleId}`);
      toast.success(`Role ${roleName} berhasil dihapus!`);

      setFormData((prev) => ({
        ...prev,
        currentRoles: prev.currentRoles.filter((r) => r !== roleName),
      }));

      router.push("/view-data/teacher-data");
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Gagal menghapus role");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSubmit = async () => {
    try {
      await api.post(`/user-roles/${id}`, {
        role_id: Number(formData.selectedRoleId),
      });
      toast.success("Role berhasil diperbarui!");
      router.push("/view-data/teacher-data");
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Gagal memperbarui data");
      }
    }
  };

  if (fetching)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-[#007D72]" size={40} />
      </div>
    );

  return (
    <div className="w-full h-full space-y-6 flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-700 flex items-center gap-3">
          <div className="p-2 bg-[#007D72]/10 rounded-lg">
            <School className="text-[#007D72]" size={32} />
          </div>
          Edit Data Guru
        </h1>
        <Link
          href="/view-data/teacher-data"
          className="flex items-center gap-2 text-slate-500 border bg-white px-4 py-2 rounded-lg"
        >
          <ArrowLeft size={16} /> Kembali
        </Link>
      </div>

      <div className="bg-white/80 border shadow-lg rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Fullname */}
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <div className="relative">
                <UserIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  value={formData.fullname}
                  onChange={(e) =>
                    setFormData({ ...formData, fullname: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-[#007D72]/50 outline-none"
                  required
                />
              </div>
            </div>

            {/* Input NIP */}
            <div className="space-y-2">
              <Label>NIP</Label>
              <div className="relative">
                <Badge
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  value={formData.nip}
                  onChange={(e) =>
                    setFormData({ ...formData, nip: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-[#007D72]/50 outline-none"
                  required
                />
              </div>
            </div>

            {/* Input Username */}
            <div className="space-y-2">
              <Label>Username</Label>
              <div className="relative">
                <UserIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-[#007D72]/50 outline-none"
                  required
                />
              </div>
            </div>

            {/* Role Section */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Shield size={16} /> Jabatan / Role Aktif
              </Label>
              <div className="flex justify-between flex-wrap gap-2 mb-2">
                {formData.currentRoles.map((role, i) => (
                  <span
                    key={i}
                    className="px-3 py-2 w-full bg-[#007D72]/10 text-[#007D72] flex justify-between text-xs font-bold rounded-full capitalize"
                  >
                    {role}
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="hover:text-red-500 transition-colors">
                          <X size={16} />
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Hapus Role?</DialogTitle>
                          <DialogDescription className="flex flex-col items-center gap-4 py-4">
                            <Trash2
                              className="text-red-500 bg-red-50 p-2 rounded-full"
                              size={48}
                            />
                            <span className="text-center">
                              Apakah Anda yakin ingin menghapus role{" "}
                              <span className="font-bold text-red-600">
                                {role}
                              </span>
                              ?
                            </span>
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Batal</Button>
                          </DialogClose>
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteRole(role)}
                            disabled={loading}
                          >
                            {loading ? (
                              <Loader2
                                className="animate-spin mr-2"
                                size={16}
                              />
                            ) : null}
                            Hapus
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </span>
                ))}
                <Dialog>
                  <DialogTrigger className="px-3 py-1 bg-[#007D72]/10 text-[#007D72] text-xs font-bold rounded-full capitalize mt-1">
                    Tambah
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Role</DialogTitle>
                      <DialogDescription>
                        <Select
                          value={formData.selectedRoleId}
                          onValueChange={(val) =>
                            setFormData({ ...formData, selectedRoleId: val })
                          }
                        >
                          <SelectTrigger className="w-full bg-gray-50">
                            <SelectValue placeholder="Tambah/Ganti Role..." />
                          </SelectTrigger>
                          <SelectContent>
                            {rolesList.map((r) => (
                              <SelectItem key={r.id} value={r.id.toString()}>
                                {r.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </DialogDescription>
                      <DialogFooter>
                        <Button
                          type="submit"
                          disabled={loading}
                          onClick={() => handleRoleSubmit()}
                        >
                          Tambah
                        </Button>
                      </DialogFooter>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                {/* <Select
                value={formData.selectedRoleId}
                onValueChange={(val) => setFormData({...formData, selectedRoleId: val})}
              >
                <SelectTrigger className="w-full bg-gray-50">
                  <SelectValue placeholder="Tambah/Ganti Role..." />
                </SelectTrigger>
                <SelectContent>
                  {rolesList.map((r) => (
                    <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-[#007D72] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#006058] transition-all disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Save size={20} />
              )}
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
