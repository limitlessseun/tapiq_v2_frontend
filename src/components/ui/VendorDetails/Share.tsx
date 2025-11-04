import Image from "next/image";
import React from "react";
import { LuFacebook } from "react-icons/lu";

export default function Share() {
  return (
    <div className="">
      <h3 className="font-bold text-indigo uppercase">Share This Result: </h3>
      <div className="flex justify-center items-center overflow-hidden max-w-6xl w-[90%] md:w-1/2 mx-auto bg-transparent">
        <Image
          src="/assets/facebook.svg"
          alt="facebook"
          width={52}
          height={52}
          className="w-1/2 -m-12 "
        />
        <Image
          src="/assets/instagram.svg"
          alt="instagram"
          width={52}
          height={52}
          className="w-1/2 -m-12 "
        />
        <Image
          src="/assets/twitter.svg"
          alt="twitter"
          width={52}
          height={52}
          className="w-1/2 -m-12 "
        />
        <Image
          src="/assets/linkedin.svg"
          alt="linkedin"
          width={52}
          height={52}
          className="w-1/2 -m-12 "
        />
        <Image
          src="/assets/tiktok.svg"
          alt="tiktok"
          width={52}
          height={52}
          className="w-1/2 -m-12 "
        />
      </div>
    </div>
  );
}
