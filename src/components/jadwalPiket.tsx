import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Card, CardContent } from "./ui/card";
import SkeletonPiket from "./sekeleton/sekeletonPiket";


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

export default function JadwalPiket({todayName, todayPiketStaff, loadingData} : {todayName: string, todayPiketStaff: Staff[], loadingData: boolean}) {
  return (
    <div className="flex flex-col md:w-1/3">
      <h2 className="md:text-xl text-md text-black/30 font-bold ml-1">
        Petugas Piket Hari {todayName}
      </h2>

      <Card className="bg-[#FFFFFF]/90 shadow-md rounded-lg overflow-hidden h-110">
        <CardContent className="p-3">
          <ScrollArea className="h-[300px] w-full">
            <div className="space-y-2">
              {todayPiketStaff.length > 0 ? (
                todayPiketStaff.map((staff) => (
                  <div
                    key={staff.id}
                    className="bg-[#CAECE9] p-3 rounded-lg w-full flex items-center shadow-sm"
                  >
                    <p className="text-gray-600 font-medium text-lg drop-shadow-sm">
                      {staff.teacher?.fullname || "Guru"}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 mt-10">
                  {loadingData
                    ? <SkeletonPiket />
                    : "Tidak ada jadwal piket hari ini"}
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
