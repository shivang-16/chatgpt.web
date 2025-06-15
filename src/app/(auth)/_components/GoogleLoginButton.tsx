"use client";

import { useAppDispatch } from "@/redux/hooks";
import { userData } from "@/redux/slices/userSlice";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const GoogleLoginButton = ({ className = "" }) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const login = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      setIsLoading(true);
      try {
        const res = await axios.post(
          "/api/google/auth",
          {
            access_token: credentialResponse.access_token,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        dispatch(userData(res.data.user));

        toast.success("Login success");

        if (res.status === 201) {
          router.replace("/initial-info");
        } else {
          router.replace("/");
        }
      } catch (error: any) {
        console.error("Axios error:", error);
        toast.error("Google login failed!");
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error: any) => {
      console.error("Google login error:", error);
      toast.error("Google login failed!");
    },
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      className={`flex items-center justify-center w-full h-12 border border-gray-600 rounded-md hover:shadow-md transition-shadow ${
        isLoading ? "cursor-not-allowed bg-gray-700" : "bg-gray-800"
      } ${className}`}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin text-white" />
      ) : (
        <div className="flex items-center gap-2">
          <Image
            src="/assets/icons/google-icon.svg"
            alt="Sign in with Google"
            width={20}
            height={20}
          />
          <span className="text-white font-medium">Sign in with Google</span>
        </div>
      )}
    </button>
  );
};

export default GoogleLoginButton;
