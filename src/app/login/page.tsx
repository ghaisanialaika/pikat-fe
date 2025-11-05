    "use client";
    import Image from "next/image";
    import { useRouter } from "next/navigation";

    export default function Login() {
    const router = useRouter();

    const handleClick = () => {
        router.push("/formlogin");
    };

    return (
        <div
        className="relative flex flex-col items-center justify-center h-screen w-full bg-cover bg-center p-5 md:px-50"
        style={{ backgroundImage: "url('/smk.jpg')" }}
        >
        <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-b from-black/70 to-[#007D72] z-0"
        />

        <div className="relative z-10 bg-gray-100 p-8 rounded-2xl shadow-xl flex flex-col justify-center items-center text-center  h-screen my-20 w-full">
            <p className="text-gray-800 mb-1 text-sm">Selamat datang, di</p>

            <Image
            src="/pinekat.svg"
            alt="Logo Piket Nekat"
            width={1000}
            height={1000}
            className="w-full max-w-40"
            />

            <button
            onClick={handleClick}
            className="bg-gray-800 hover:bg-black text-white rounded-sm px-10 py-1 mt-3 text-sm transition-transform duration-200 hover:scale-105"
            >
            Masuk dengan login
            </button>
        </div>
        </div>
    );
    }
