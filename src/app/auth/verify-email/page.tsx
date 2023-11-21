"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { ThemeSwitcher } from "@/app/components/ThemeSwitcher";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    const verifyUserEmail = async () => {
      try {
        console.log(token);
        toast.loading("Verifying email");
        const response = await axios.post("/api/auth/verify-email", { token });
        toast.remove();
        if (response.data.success === false) {
          toast.error(response.data.message);
          return;
        }
        toast.success(response.data.message);
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      } catch (error: any) {
        toast.remove();
        // console.log(error.response);
        toast.error(error.response.data.error + " " + error.response.status);
      }
    };

    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token, router]);

  return (
    <div className="hero min-h-screen bg-base-200">
      <Toaster />
      <div className="flex-col justify-center shadow-2xl rounded-box hero-content lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="mb-5 text-5xl font-bold">Verify Email</h1>
          <p className="mb-5">
            Welcome to Kalamandir! Verifying your email is required to continue.
          </p>
        </div>
        <div className="card flex-shrink-0 w-full m-3 max-w-sm shadow-xl shadow-neutral bg-base-100">
          <div className="card-body pb-5">
            <div className="flex justify-center">
              <ThemeSwitcher />
            </div>
            <div className="form-control">
              <label
                className="label font-normal py-0.5 text-primary"
                htmlFor="token"
              >
                Token
              </label>
              <textarea
                className="textarea textarea-accent disabled:opacity-50"
                placeholder="Token"
                name="token"
                id="token"
                defaultValue={token}
              />
            </div>
            <div className="card-body pt-3 px-3">
              <div className={`flex items-center justify-center`}>
                <p className={` labelfont-normal py-0.5 text-secondary`}>
                  If Already Verified
                </p>
                <Link href="/auth/login" className="btn btn-link">
                  Login
                </Link>
              </div>
              <hr className="bg-base-300 border-t-2 border-neutral" />
              <div className={`flex items-center justify-center`}>
                <p className="label font-normal py-0.5 text-secondary">
                  If Link expired resend verification go to signup
                </p>
                <Link href="/auth/signup" className="btn btn-link">
                  Signup
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
