"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
// import './FormLogin.css';

type FormData = {
  nip: string;
  password: string;
};

const FormLogin = () => {
  const [formData, setFormData] = useState<FormData>({
    nip: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.nip) {
      newErrors.nip = "NIP is required";
    } else if (formData.nip.length < 10) {
      newErrors.nip = "NIP is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Login successful", formData);
      router.push("/dashboard");
    }
  };

  return (
    <div
      className="form-login-container relative flex flex-col items-center justify-center h-screen w-full bg-cover bg-center p-5"
      style={{ backgroundImage: "url('/DJI_0868.JPG')" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-black/70 to-[#007D72] z-0"
      />
      <div className="form-login-cardrelative z-10 bg-gray-100 p-8 rounded-2xl shadow-xl flex flex-col justify-center items-center text-center max-w-lg w-full">
        <Image
          src="/logo pikatt.png"
          width={100}
          height={100}
          alt="Logo Piket Nekat"
        />
        <h1 className="text-2xl font-bold mb-4 text-black">LOGIN</h1>
        <form onSubmit={handleSubmit} className="login-form w-full mx-5">
          <div className="form-group">
            <label htmlFor="nip" className="flex justify-start items-start">NIP</label>
            <Input
              type="text"
              id="nip"
              name="nip"
              value={formData.nip}
              onChange={handleChange}
              className={errors.nip ? "error" : ""}
              placeholder="Enter your NIP"
            />
            {errors.nip && <span className="error-message">{errors.nip}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password"  className="flex justify-start items-start">Password</label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
              placeholder="Enter your password"
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="bg-gray-800 hover:bg-black text-white rounded-sm px-10 py-1 mt-3 text-lg  transition-transform duration-200 hover:scale-105"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormLogin;
