"use client";
import { AlertCircle, BookOpen, Loader2, User } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

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

    useEffect(() =>  {
        fetchAssignments();
    },[]);

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
      <div className="bg-white/90 shadow-md rounded-lg p-1 flex-1 border justify-center items-center border-white/50 overflow-hidden  ">
        <ScrollArea className="w-full whitespace-nowrap h-full">
          <div className="flex w-full space-x-4 p-2 h-full justify-start items-center">
            {assignments.length > 0 ? (
              assignments.map((note) => (
                <Card
                  key={note.id}
                  className="max-w-[300px] min-w-[225px] border-l-4 border-l-[#00786E] h-full bg-black/5 border-y-0 border-r-0 shadow-sm hover:shadow-md transition-all whitespace-normal"
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
                    <p className="text-sm text-gray-600 bg-white p-2 rounded border border-yellow-100 italic line-clamp-3">
                      {note.assignment_details}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-50 text-gray-400">
                {loadingData ? (
                  <Loader2 className="animate-spin mb-2 flex justify-center items-center" />
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