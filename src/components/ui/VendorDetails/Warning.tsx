import React from "react";

interface SafeTipsProps {
  vendorData: any[];
}
const Warning: React.FC<SafeTipsProps> = ({ vendorData }) => {
  const data = [
    "business registration",
    "Request a video call before payment ",
    "Check their social media history",
    "Start with small orders ",
  ];

  return (
    <div>
      <div className="flex flex-col items-center gap-2">
        {data.map((item, index) => (
          <div className="bg-white p-1 rounded w-full">
            <div
              className=" rounded  bg-linear-to-br from-[#FFFFFF] to-[#E1EAFD]"
              key={index}
            >
              <p className="text-sm text-gray flex items-center gap-2 p-2">
                <img src="/assets/checkmark.svg" className="h-4 w-4" /> {item}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="font-manrope flex flex-col gap-4 mt-6">
        <div className="flex items-center gap-8">
          <p className="font-bold">Status:</p>
          <span className="text-xs text-white bg-danger rounded-4xl py-2 px-4 flex items-center justify-center gap-2">
            <span>•</span>
            High Risk
          </span>
        </div>
        <div className="flex items-center gap-4"></div>
      </div>
    </div>
  );
};

export default Warning;
