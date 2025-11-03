import React from "react";
import { LuFacebook } from "react-icons/lu";

export default function Share() {
  return (
    <div className="">
      <h3 className="font-bold text-indigo uppercase">Share This Result: </h3>
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="flex items-center justify-center  bg-linear-to-br from-[#F3F5F9] to-[#F3F5F92E] w-12 h-12 rounded-full p-2">
          <span className="border-white border border-solid  rounded-full w-full h-full flex items-center justify-center  bg-linear-to-br from-[#F3F5F9] to-[#F3F5F92E]">
            <span className="border-white border border-solid  rounded-full w-full h-full flex items-center justify-center  bg-[#2F6EFF2E] ">
              <LuFacebook />
            </span>{" "}
          </span>
        </div>
        <div className="flex items-center justify-center  bg-linear-to-br from-[#F3F5F9] to-[#F3F5F92E] w-12 h-12 rounded-full p-2">
          <span className="border-white border border-solid  rounded-full w-full h-full flex items-center justify-center  bg-linear-to-br from-[#F3F5F9] to-[#F3F5F92E]">
            <span className="border-white border border-solid  rounded-full w-full h-full flex items-center justify-center  bg-[#2F6EFF2E] ">
              <LuFacebook />
            </span>{" "}
          </span>
        </div>
        <div className="flex items-center justify-center  bg-linear-to-br from-[#F3F5F9] to-[#F3F5F92E] w-12 h-12 rounded-full p-2">
          <span className="border-white border border-solid  rounded-full w-full h-full flex items-center justify-center  bg-linear-to-br from-[#F3F5F9] to-[#F3F5F92E]">
            <span className="border-white border border-solid  rounded-full w-full h-full flex items-center justify-center  bg-[#2F6EFF2E] ">
              <LuFacebook />
            </span>{" "}
          </span>
        </div>
        <div className="flex items-center justify-center  bg-linear-to-br from-[#F3F5F9] to-[#F3F5F92E] w-12 h-12 rounded-full p-2">
          <span className="border-white border border-solid  rounded-full w-full h-full flex items-center justify-center  bg-linear-to-br from-[#F3F5F9] to-[#F3F5F92E]">
            <span className="border-white border border-solid  rounded-full w-full h-full flex items-center justify-center  bg-[#2F6EFF2E] ">
              <LuFacebook />
            </span>{" "}
          </span>
        </div>
      </div>
    </div>
  );
}
