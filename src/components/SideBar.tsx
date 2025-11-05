import Image from "next/image";

export default function SideBar() {
  return (
    <>
      <nav className="bg-[#bae2df] p-2 h-screen w-full max-w-45 overflow-hidden">
        <div className="flex justify-center items-center">
          <Image
            src="/pinekat.svg"
            alt="logo pinekat"
            width={1000}
            height={1000}
            className="w-full max-w-55"
          />
        </div>
        SideBar

      </nav>
    </>
  );
}
