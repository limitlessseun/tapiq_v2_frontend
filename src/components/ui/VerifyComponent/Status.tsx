import React from "react";

export default function Status() {
  return (
    <div className="font-manrope flex flex-col gap-4">
      <div className="flex items-center gap-8">
        <p className="font-bold">Status:</p>

        <span className="text-xs text-white bg-teal rounded-4xl py-2 px-4 flex items-center justify-center gap-2">
          <span>•</span>
          Low Risk
        </span>
      </div>
      <div className="flex items-center gap-4">
        <img src="/assets/experience-icon.svg" className="h-8 w-8" />
        <p className="text-primary font-medium ">Had an Experience?</p>
      </div>
    </div>
  );
}
