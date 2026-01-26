export default function Waktu({formattedTime, formattedDate, formattedYear} : {formattedTime: string, formattedDate: string, formattedYear: number}) {
  return (
    <div className="w-full h-32 bg-[#00786E]/60 shadow-md rounded-lg p-8 flex justify-center items-center ">
      <p className="sm:text-6xl text-4xl md:text-8xl font-bold text-white">
        {formattedTime}
      </p>
      <div className="ml-5 md:ml-10 flex flex-col">
        <p className="text-3xl md:text-5xl font-bold text-white">
          {formattedDate}
        </p>
        <p className="text-3xl md:text-5xl font-bold text-white">
          {formattedYear}
        </p>
      </div>
    </div>
  );
}
