"use client";

import AuthNav from "@/components/ui/AuthComponent/AuthNav";
import SwitchInput from "@/components/ui/switch";
import TextInput from "@/components/ui/TextInput";

const ComponentTest = () => {
  return (
    <div>
      <TextInput />
      <SwitchInput checked={true} onCheckedChange={() => {}} />
      <TextInput
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={""}
        onChange={() => {}}
        error={"Password must be at least 8 characters"}
      />
      <AuthNav />
    </div>
  );
};

export default ComponentTest;
