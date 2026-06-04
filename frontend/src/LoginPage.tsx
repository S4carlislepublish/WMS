import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import {
  LockClosedIcon,
  UserCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/solid';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setLoading(true);

  try {

    const response = await login(
      formData.email,
      formData.password
    );

    const role = response.role || "";

    const employeeRoles = [
      "Pre-Editing",
      "Copywriting",
      "QA"
    ];

    const isEmployee =
      employeeRoles.includes(role);

    // Employee First Login
    if (
      isEmployee &&
      (
        response.profile_completed === false ||
        response.is_first_login === true
      )
    ) {

      navigate("/complete-profile");

    }

    // Employee Dashboard
    else if (isEmployee) {

      navigate("/employee-dashboard");

    }

    // HR Dashboard
    else if (
      role === "HR"
    ) {

      navigate("/dashboard");

    }

    // Admin Dashboard
    else if (
      role === "Admin" ||
      role === "Super Admin"
    ) {

      navigate("/dashboard");

    }

    // Default Dashboard
    else {

      navigate("/dashboard");

    }

  } catch (error: any) {

    console.error(error);

    toast.error(
      error.response?.data?.error ||
      "Login failed"
    );

  } finally {

    setLoading(false);

  }
};

const [showCheckIn, setShowCheckIn] = useState(false);
const [loggedUser, setLoggedUser] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800 rounded-lg shadow-2xl p-8"
      >
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center mb-4">
            <UserCircleIcon className="h-10 w-10 text-gray-900" />
          </div>
          <h1 className="text-3xl font-bold text-white">Workflow Management System</h1>
          <p className="text-gray-400 mt-2">Enterprise Publishing Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
  type={showPassword ? "text" : "password"}
  required
  value={formData.password}
  onChange={(e) =>
    setFormData({
      ...formData,
      password: e.target.value,
    })
  }
  className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
  placeholder="Enter your password"
/>

<button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  className="absolute inset-y-0 right-0 pr-3 flex items-center"
>
  {showPassword ? (
    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-white" />
  ) : (
    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-white" />
  )}
</button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-gray-900 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          No signup available. Contact Admin to create an account.
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;