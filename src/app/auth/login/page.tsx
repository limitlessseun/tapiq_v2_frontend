"use client";
import { Button } from "@/components/ui/button";
import SwitchInput from "@/components/ui/switch";
import TextInput from "@/components/ui/TextInput";
import { useRouter } from "next/navigation";
import React from "react";

export default function Login() {
  const router = useRouter();
  return (
    <div className="space-y-4 my-6">
      <TextInput
        label="Phone Number"
        type="tel"
        placeholder="+234 ___ ___ ____"
        // //value={""}
        onChange={() => { }}
      />

      <TextInput
        label="Password"
        type="password"
        placeholder="Enter your password"
        // //value={""}
        onChange={() => { }}
      // error={"Password must be at least 8 characters"}
      />

      <div>
        <p className="text-sm text-gray font-satoshi">
          Didn't receive the code?{" "}
          <Button variant={"link"} className="px-0 underline">
            Resend
          </Button>
        </p>
      </div>

      <div>
        <SwitchInput
          checked={true}
          onCheckedChange={() => { }}
          label="Remember Me"
        />
      </div>

      <Button
        variant={"primary"}
        size={"lg"}
        onClick={() => {
          router.push("/auth/login");
        }}
      >
        Sign In
      </Button>
      <div>
        <p className="text-sm text-gray text-start font-satoshi">
          Don’t have an account?{" "}
          <Button
            variant={"link"}
            className="px-0"
            onClick={() => {
              router.push("/auth/register");
            }}
          >
            Sign Up
          </Button>
        </p>
      </div>
    </div>
  );
}
