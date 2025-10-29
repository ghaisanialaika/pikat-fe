'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './FormLogin.css';

type FormData = {
  nip: string;
  password: string;
};

const FormLogin = () => {
  const [formData, setFormData] = useState<FormData>({
    nip: '',
    password: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.nip) {
      newErrors.nip = 'NIP is required';
    } else if (formData.nip.length < 10) {
      newErrors.nip = 'NIP is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Login successful', formData);
      router.push('/dashboard');
    }
  };

  return (
    <div className="form-login-container">
      <div className="form-login-card">
        <img src="/logo pikatt.png" alt="Logo Piket Nekat" />
        <h2>LOGIN</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="nip">NIP</label>
            <input
              type="text"
              id="nip"
              name="nip"
              value={formData.nip}
              onChange={handleChange}
              className={errors.nip ? 'error' : ''}
              placeholder="Enter your NIP"
            />
            {errors.nip && <span className="error-message">{errors.nip}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <button type="submit" className="login-submit-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormLogin;
