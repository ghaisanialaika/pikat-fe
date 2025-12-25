"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LogOut,
  Menu,
  X,
  Home,
  Table,
  Clock,
  Edit,
  Eye,
  ChevronDown, 
  ChevronUp,
} from "lucide-react";
import api from "@/lib/axios";
import Image from "next/image";
import { ScrollArea } from "./ui/scroll-area";

interface UserAuth {
  id: number;
  username: string;
  fullname: string;
  roles: string[];
}

export default function SideBar() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserAuth | null>(null);
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

    const hasAccess = (itemRoles?: string[]) => {
      if (!itemRoles || itemRoles.length === 0) return true;
      if (!user) return false;

      return itemRoles.some((role) => user.roles.includes(role));
    };



  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUser();
  }, []);

useEffect(() => {
  menuItems
    .filter((item) => hasAccess(item.roles))
    .forEach((item) => {
      if (item.subLinks) {
        const isActive = item.subLinks
          .filter((sub) => hasAccess(sub.roles))
          .some((sub) => pathname === sub.href);

        if (isActive) setOpenSubMenu(item.name);
      }
    });
}, [pathname, user]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {}
    localStorage.clear();
    window.location.href = "/login";
  };

  const toggleSubMenu = (menuName: string) => {
    if (openSubMenu === menuName) {
      setOpenSubMenu(null); 
    } else {
      setOpenSubMenu(menuName);
    }
  };

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      roles: ["admin", "piket", "mapel"],
    },
    {
      name: "Laporan Izin",
      href: "/report",
      icon: Table,
      roles: ["piket", "admin"],
    },
    {
      name: "Persetujuan Izin",
      href: "/picket-approval",
      icon: Table,
      roles: ["piket", "admin"],
    },
    {
      name: "Jadwal Piket",
      href: "/picket-schedule",
      icon: Clock,
      roles: ["piket", "admin"],
    },
    {
      name: "Buat Surat Izin",
      href: "/license",
      icon: Edit,
      roles: ["mapel", "admin"],
    },
    {
      name: "Kelola Data",
      href: "/view-data",
      subLinks: [
        {
          name: "Data Guru Mapel",
          href: "/view-data/teacher-data",
          roles: ["admin"],
        },
      ],
      icon: Eye,
      roles: ["admin"],
    },
  ];


  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-60 p-2 bg-[#007D72] text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
        fixed left-0 top-0 h-screen w-64 text-white flex flex-col z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0
        print:hidden
      `}
      >
        <div className="p-3 flex items-center gap-3 px-15">
          <Image
            src="/Logo.png"
            width={1000}
            height={1000}
            alt="Logo"
            className="w-25"
          />
        </div>

        <nav className="flex-1 space-y-2 py-4 overflow-y-auto">
          {menuItems
            .filter((item) => hasAccess(item.roles))
            .map((item) => {
              const hasSubLinks = item.subLinks && item.subLinks.length > 0;

              const isParentActive = hasSubLinks
                ? item.subLinks?.some((sub) => pathname === sub.href)
                : pathname === item.href;

              if (hasSubLinks) {
                return (
                  <div key={item.name} className="flex flex-col">
                    <button
                      onClick={() => toggleSubMenu(item.name)}
                      className={`relative flex items-center justify-between px-10 py-3 transition-all duration-200 group w-full ${
                        isParentActive
                          ? "text-[#007D72]"
                          : "text-slate-800 hover:bg-[#007D72] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center">
                        {isParentActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-[80%] w-1.5 bg-[#007D72] rounded-full" />
                        )}
                        <item.icon
                          size={25}
                          className={`mr-2 ${
                            isParentActive
                              ? "text-[#007D72]"
                              : "text-slate-500 group-hover:text-white"
                          }`}
                        />
                        <span className="font-medium text-md">{item.name}</span>
                      </div>
                      {openSubMenu === item.name ? (
                        <ChevronUp
                          size={18}
                          className={
                            isParentActive
                              ? "text-[#007D72]"
                              : "text-slate-500 group-hover:text-white"
                          }
                        />
                      ) : (
                        <ChevronDown
                          size={18}
                          className={
                            isParentActive
                              ? "text-[#007D72]"
                              : "text-slate-500 group-hover:text-white"
                          }
                        />
                      )}
                    </button>

                    {openSubMenu === item.name && (
                      <div className="bg-slate-50/50 py-1">
                        <ScrollArea className="">
                          {item.subLinks
                            ?.filter((subItem) => hasAccess(subItem.roles))
                            .map((subItem) => {
                              const isSubActive = pathname === subItem.href;
                              return (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  className={`flex items-center pl-20 pr-4 py-2 text-sm transition-all duration-200 ${
                                    isSubActive
                                      ? "text-[#007D72] font-bold"
                                      : "text-slate-500 hover:text-[#007D72]"
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                      isSubActive
                                        ? "bg-[#007D72]"
                                        : "bg-slate-300"
                                    }`}
                                  ></span>
                                  {subItem.name}
                                </Link>
                              );
                            })}
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center px-10 py-3 transition-all duration-200 group ${
                    isActive
                      ? "text-[#007D72] "
                      : "text-slate-800 hover:bg-[#007D72] hover:text-white "
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-[80%] w-1.5 bg-[#007D72] rounded-full" />
                  )}

                  <item.icon
                    size={25}
                    className={`
                      mr-2
                    ${
                      isActive
                        ? "text-[#007D72]"
                        : "text-slate-500 group-hover:text-white"
                    }
                    `}
                  />
                  <span className="font-medium text-md ">{item.name}</span>
                </Link>
              );
            })}
        </nav>

        <div className="p-4 my-25 m-2 rounded-2xl">
          <div className="p-4 mx-3 mb-3 rounded-xl bg-white shadow-sm border">
            {user && (
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#007D72]/20 flex items-center justify-center text-[#007D72] font-bold text-lg">
                  {user.fullname?.charAt(0) || user.username.charAt(0)}
                </div>

                <div className="flex flex-col leading-tight">
                  <span className="font-bold text-gray-800">
                    {user.fullname || user.username}
                  </span>

                  <span className="text-xs font-semibold text-[#007D72] bg-[#007D72]/10 px-2 py-0.5 rounded-full w-fit">
                    {user.roles.join(", ")}
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-2 w-full
    text-red-600 hover:bg-red-600 hover:text-white
    rounded-lg transition-all duration-300 font-semibold"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
