"use client";

import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { useUserAuth } from "@/zin-frontend/context/UserAuthProvider";
import { verifyUser } from "@/lib/api/api";
import { toast } from "./ui/use-toast";
import { useNavigate } from "react-router-dom";


export function BoxedOtpInput() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const { userEmail, setIsUserAuthenticated } = useUserAuth();

  const handleChange = (element, index) => {
    if (isNaN(Number(element.target.value))) return false;

    setOtp([
      ...otp.map((d, idx) => (idx === index ? element.target.value : d)),
    ]);

    // Focus next input
    if (element.target.value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Check if all OTP digits have been filled
  const isOtpComplete = otp.every((digit) => digit !== "");

  const handleVerify = async()=> {

    const data = await verifyUser(userEmail, otp);
    console.log(data)

    if (data.success) {
      localStorage.setItem("UserCookie", data.authToken);
      navigate("/");
      setIsUserAuthenticated(true);
      toast({
        title: "Sign-up successful!",
      });
    } else {
      toast({
        title: data.error,
      });
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-2xl font-bold">Enter OTP</h2>
      <p className="text-zinc-500 text-sm">An OTP has been sent to {userEmail} </p>
      <div className="flex space-x-2">
        {otp.map((data, index) => (
          <Input
            key={index}
            type="text"
            maxLength={1}
            className="w-12 h-12 text-center text-2xl"
            value={data}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleBackspace(e, index)}
            ref={(input) => (inputRefs.current[index] = input)}
          />
        ))}
      </div>
      <Button
        onClick={handleVerify}
        disabled={!isOtpComplete}
        className="p-2 px-4 font-sans font-semibold bg-blue-700 rounded-full"
      >
        VERIFY
      </Button>
    </div>
  );
}
