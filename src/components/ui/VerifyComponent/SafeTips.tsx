import React from "react";
import WhatThisMeans from "./WhatThisMeans";
import Status from "./Status";

interface SafeTipsProps {
  vendorData: any[];
}
const SafeTips: React.FC<SafeTipsProps> = ({ vendorData }) => {
  const data = [
    "business registration",
    "Request a video call before payment ",
    "Check their social media history",
    "Start with small orders ",
  ];

  const data2 = [
    "No reports in our database (yet)",
    "Could be new, legitimate, or unreported",
    "Be extra cautious - ask questions first",
  ];

  return (
    <div>
      {vendorData.length < 1 ? (
        <div className="font-manrope flex flex-col gap-4">
          <WhatThisMeans
            childeren={
              <div>
                <h3 className="font-bold text-lg mb-4">What This Means:</h3>
                <ul className="space-y-1 pl-2">
                  {data2.map((item, index) => (
                    <li key={item} className="flex items-start font-light">
                      <span className="mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            }
          />
          <h3 className="font-bold text-indigo">Stay Safe Tips:</h3>
          <div className="flex flex-col gap-2 py-2">
            {data.map((item, index) => (
              <div className="bg-white p-1 rounded">
                <div
                  className=" rounded  bg-linear-to-br from-[#FFFFFF] to-[#E1EAFD]"
                  key={index}
                >
                  <p className="text-sm text-gray flex items-center gap-2 p-2">
                    <img src="/assets/checkmark.svg" className="h-4 w-4" />{" "}
                    {item}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Status />
        </div>
      ) : (
        <div className="">
          <div className=" p-1 rounded flex flex-col gap-3">
            <div className=" rounded  bg-linear-to-br from-[#FFFFFF] to-[#E1EAFD]">
              <p className="text-sm text-gray flex items-center gap-2 px-2">
                <img src="/assets/vendorCount-icon.svg" className="h-10 w-10" />
                <span className="text-indigo py-2 font-medium">
                  300 vendors
                </span>{" "}
                checked
              </p>
            </div>
            <div className=" rounded  bg-linear-to-br from-[#FFFFFF] to-[#E1EAFD]">
              <p className="text-sm text-gray flex items-center gap-2 px-2">
                <img src="/assets/vendorCount-icon.svg" className="h-10 w-10" />
                <span className="text-indigo py-2 font-medium">
                  Millions
                </span>{" "}
                of Naira protected{" "}
              </p>
            </div>
            <div className=" rounded  bg-linear-to-br from-[#FFFFFF] to-[#E1EAFD]">
              <p className="text-sm text-gray flex items-center gap-2 px-2">
                <img src="/assets/vendorCount-icon.svg" className="h-10 w-10" />
                <span className="text-indigo py-2 font-medium">
                  Updated live{" "}
                </span>{" "}
              </p>
            </div>
            <div className=" rounded  bg-linear-to-br from-[#FFFFFF] to-[#E1EAFD]">
              <p className="text-sm text-gray flex items-center gap-2 px-2">
                <img src="/assets/vendorCount-icon.svg" className="h-10 w-10" />
                <span className="text-indigo py-2 font-medium">
                  3,247 searches
                </span>{" "}
                in the last
                <span className="text-indigo py-2 font-medium">
                  24 hours{" "}
                </span>{" "}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafeTips;
