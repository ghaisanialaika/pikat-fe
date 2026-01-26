"use client";
import { AlertCircle, BookOpen, Loader2, User } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";

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

export default function TabelTugasGuru() {
  const [loadingData, setLoadingData] = useState(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const fetchAssignments = async () => {
    setLoadingData(true);
    try {
      const res = await api.get("/teacher-assignments", {
        withCredentials: true,
      });
      setAssignments(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const deleteAssignment = async (id: number) => {
    setLoadingData(true);
    try {
      await api.delete(`/teacher-assignments/${id}`, {
        withCredentials: true,
      });
      fetchAssignments();
      toast.success("Tugas berhasil dihapus");
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
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

  return (
    <>
      <h2>
        <span className="block text-xl font-bold text-gray-600 drop-shadow-2xl">
          Tugas Guru
        </span>
      </h2>
      <div className="bg-white/90 shadow-md rounded-lg p-3.5 border justify-center items-center border-white/50 overflow-hidden  ">
        <ScrollArea className="w-full whitespace-nowrap h-full  ">
          <div className="flex w-full space-x-4 p-2 h-60 justify-start items-center">
            {assignments.length > 0 ? (
              assignments.map((note) => (
                <Dialog key={note.id}>
                  <DialogTrigger asChild>
                    <Card
                      key={note.id}
                      className="w-[300px] min-w-[225px] border-l-4 border-l-[#00786E] h-full bg-black/5 border-y-0 border-r-0 shadow-sm hover:shadow-md transition-all whitespace-normal"
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
                              <BookOpen size={16} className="text-[#007D72]" />
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
                        </div>
                        <p className="text-sm text-gray-600 bg-white p-2 rounded border border-yellow-100 italic line-clamp-3 overflow-hidden">
                          {note.assignment_details}
                        </p>
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
                            <strong>{formatTanggalIndo(note.due_date)}</strong>
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

                          <ScrollArea className="text-sm text-gray-600 bg-white p-2 rounded border border-yellow-100 italic h-24 whitespace-normal">
                            {note.assignment_details}
                          </ScrollArea>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                    <div className="w-full flex justify-end gap-2">
                      {loadingData ? (
                        <Loader2
                          className="animate-spin w-full justify-center items-center"
                          size={40}
                        />
                      ) : (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="bg-[#00786E]/60 text-white font-bold hover:bg-[#00786E] hover:text-white transition-all"
                            >
                              Selesai
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Tugas ini telah disampaikan?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Jika sudah maka tugas ini boleh diselesaikan dan
                                hapus dari list tugas titipan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <div className="">
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteAssignment(note.id)}
                                >
                                  Selesai
                                </AlertDialogAction>
                              </div>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
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
                {loadingData ? (
                  <Loader2
                    className="animate-spin mb-2 flex justify-center items-center"
                    size={50}
                  />
                ) : (
                  <>
                    <AlertCircle className="mb-2" />
                    Belum ada tugas titipan
                  </>
                )}
              </div>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
}
