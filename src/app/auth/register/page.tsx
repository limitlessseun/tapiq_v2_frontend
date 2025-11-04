"use client";
import { Button } from "@/components/ui/button";
import CheckboxInput from "@/components/ui/Checkbox";
import TextInput from "@/components/ui/TextInput";

export default function Register() {
  return (
    <div className="space-y-4 my-6">
      <TextInput
        label="First Name"
        type="text"
        placeholder="Enter First Name"
        value={""}
        onChange={() => { }}
      />

      <TextInput
        label="Last Name"
        type="text"
        placeholder="Enter Last Name"
        value={""}
        onChange={() => { }}
      />

      <TextInput
        label="Email Address"
        type="email"
        placeholder="user@example.com"
        value={""}
        onChange={() => { }}
      // error={"Please enter a valid email address"}
      />

      <TextInput
        label="Phone Number"
        type="tel"
        placeholder="+234 ___ ___ ____"
        value={""}
        onChange={() => { }}
      />

      {/* <TextInput
        label="Verification Code"
        type="password"
        placeholder="**********"
        value={""}
        onChange={() => {}}
      /> */}

      <TextInput
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={""}
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
      <div className="flex items-center space-x-2 font-satoshi">
        <CheckboxInput />
        <p className="text-sm text-gray">Didn't receive the code?</p>
      </div>

      <Button
        variant={"primary"}
        style={{
          border: "1px solid",

          borderImage: `
              linear-gradient(180deg, rgba(255, 255, 255, 0.8) -25.96%, rgba(255, 255, 255, 0) 100%),
              linear-gradient(270deg, rgba(255, 255, 255, 0) 12.54%, rgba(255, 255, 255, 0.8) 47.67%, rgba(255, 255, 255, 0) 82.8%)
              1
            `,
        }}
        size={"lg"}
      >
        Create a TapIQ Account
      </Button>
      <div>
        <p className="text-sm text-gray text-center font-satoshi">
          Already have an account?{" "}
          <Button variant={"link"} className="px-0 underline">
            Login
          </Button>
        </p>
      </div>
      <div className="flex flex-col gap-2 items-start w-[70%] mx-auto font-satoshi">
        <div className="flex items-center space-x-2">
          <img src="/assets/check-icon.svg" className="w-5 h-5" />
          <p className="text-sm text-gray">We will never sell your data</p>
        </div>
        <div className="flex items-center space-x-2">
          <img src="/assets/check-icon.svg" className="w-5 h-5" />
          <p className="text-sm text-gray">AES 256-bit encryption in use</p>
        </div>
      </div>
    </div>
  );
}
