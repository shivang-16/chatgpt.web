'use client'
import React, { useState } from 'react';
import GoogleLoginButton from '../_components/GoogleLoginButton';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation'; 
import axios from 'axios';
import { userData } from '@/redux/slices/userSlice';
import { useAppDispatch } from '@/redux/hooks';


const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const router = useRouter();
  const dispatch = useAppDispatch()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/signup', {
        formData
      }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast.success('Registration successful!');
        dispatch(userData(response.data.user))
        router.push('/'); // Redirect to homepage on success
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Signup Form */}
      <div className="flex-[0.60] flex items-center justify-center bg-[#161414] text-white">
        <div className="w-full max-w-md p-8">
          {/* Logo Section */}
          <div className="flex justify-center mb-8">
            <img
              src="/logo.png" 
              alt="Logo"
              className=" h-10 w-10 rounded-lg invert"
            />
          </div>

          {/* Header */}
          <h2 className="text-xl font-semibold mb-4 text-center">
            Welcome | Register with us!
          </h2>
          <p className="text-gray-400 text-center mb-6">
            You are close to getting a job.
          </p>

          {/* Google Signup Section */}
          <div className="space-y-4 mb-6">
            <GoogleLoginButton />
          </div>

          {/* OR Divider */}
          <div className="flex items-center justify-center my-4">
            <div className="h-px bg-gray-600 w-full"></div>
            <span className="text-gray-500 px-4 text-sm">OR</span>
            <div className="h-px bg-gray-600 w-full"></div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center justify-between mb-6">
              <a href="#" className="text-gray-400 hover:text-white">Forgot password?</a>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-white text-black rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
            >
              Sign up
            </button>
          </form>

          {/* Footer */}
          <p className="text-center mt-4 text-gray-400">
            Already have an account? <Link href="/login" className="text-white underline">Login</Link>
          </p>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="flex-[0.40] bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center animate-gradient">
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-4">Join us and start your journey!</h3>
          <p className="text-gray-500">Your ultimate go-to chating companion.</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
