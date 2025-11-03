import React from "react";
interface WhatThisMeansProps {
  childeren: React.ReactNode;
}
const WhatThisMeans: React.FC<WhatThisMeansProps> = ({ childeren }) => {
  return (
    <div
      className="bg-linear-to-br from-[#057EB7] via-[#141986] to-[#0E1264]  rounded-2xl overflow-hidden "
      style={{
        backgroundImage: `url("/assets/lineimage.jpg")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="relative text-white  font-manrope flex flex-col bg-gradient-to-b from-[rgba(5,126,183,0.8)] from-[2.1%]
        via-[rgba(20,25,134,0.8)] via-[50.13%] to-[rgba(14,18,100,0.8)]  p-4 "
      >
        {" "}
        {childeren}
        <img
          src="/assets/bulb-icon.svg"
          className="h-12 w-12 absolute top-1 right-1"
        />
      </div>
    </div>
  );
};

export default WhatThisMeans;
