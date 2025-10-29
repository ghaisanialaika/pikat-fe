"use client";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/formlogin");
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/smk.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/65 z-0"></div>

      {/* Title */}
      <h1 className="absolute top-4 left-6 text-sm text-gray-300 font-semibold tracking-wider z-10">
        LOGIN
      </h1>

      {/* Card */}
      <div className="relative z-10 bg-gray-100 p-8 rounded-2xl shadow-xl text-center max-w-sm w-full">
        <p className="text-gray-800 mb-6 text-lg font-medium">
          Selamat datang, di
        </p>

        {/* Logo */}
        <div className="flex justify-center items-start mb-10">
          <span className="text-[100px] font-extrabold text-teal-600 leading-none mr-2">
            P
          </span>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[36px] font-bold text-black">iket</span>
            <div className="flex items-center text-[36px] font-bold">
              <span className="text-black">N</span>
              <span className="text-teal-600">ekat</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleClick}
          className="bg-gray-800 hover:bg-black text-white rounded-full px-10 py-3 text-base font-medium transition-transform duration-200 hover:scale-105"
        >
          Masuk dengan login
        </button>
      </div>
    </div>
  );
}
