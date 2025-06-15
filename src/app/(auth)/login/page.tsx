'use client'
import React, { useState, useEffect } from 'react';
import GoogleLoginButton from '../_components/GoogleLoginButton'; // Import your Google Login component
import Link from 'next/link';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAppDispatch } from '@/redux/hooks';
import { userData } from '@/redux/slices/userSlice';

// Custom hook for typewriter effect
const useTypewriter = (texts: string[], speed: number) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (currentCharIndex < texts[currentTextIndex].length) {
        setDisplayedText((prev) => prev + texts[currentTextIndex][currentCharIndex]);
        setCurrentCharIndex((prev) => prev + 1);
      } else {
        setTimeout(() => {
          setDisplayedText('');
          setCurrentCharIndex(0);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }, 2000); // Pause before starting the next text
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [currentCharIndex, currentTextIndex, texts, speed]);

  return displayedText;
};

const Login = () => {
  const [formData, setFormData] = useState({
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
      const response = await axios.post('/api/auth/login', formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast.success('Login successful!');
        dispatch(userData(response.data.user))
        router.push('/'); // Redirect to homepage on success
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
  };

  const typewriterText = useTypewriter(
    [
      'Your AI companion for intelligent conversations.',
      'Ask anything, get instant answers.',
      'Unleash the power of AI in your daily tasks.',
      'Seamlessly interact with advanced AI models.',
    ],
    100 // Speed of typing in milliseconds
  );

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Login Form */}
      <div className="flex-1 md:flex-[0.60] flex items-center justify-center bg-[#161414] text-white">
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
            Sign in
          </h2>
          <p className="text-gray-400 text-center mb-6">
            Don't have an account? <Link href={'/signup'} className="text-white underline">Create one</Link>
          </p>

          {/* Social Login Buttons */}
          <div className="space-y-4 mb-6">
            <GoogleLoginButton/>
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
              className="w-full py-2 px-4 bg-gray-800 my-2 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
              onClick={() => setFormData({ email: 'shivangyadav121@gmail.com', password: 'hello' }) }
            >
              Login as guest
            </button>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-white text-black rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden md:flex flex-[0.40] bg-gradient-to-br from-gray-900 to-black text-white items-center justify-center animate-gradient">
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-4">{typewriterText}</h3>
          <p className="text-gray-500">Your ultimate go-to chating companion.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;


